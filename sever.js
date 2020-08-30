const express = require("express");
const app = express();
const server = require("http").createServer(app);
var ww = require("./wwtheme.js");

const portNumber = 3000;
server.listen(portNumber, () => {
  console.log("起動しました", "http://localhost:" + portNumber);
});
app.use(express.static("./"));

const socketio = require("socket.io");
const io = socketio.listen(server);
let userlist = {};
let roomstorage = {};
io.on("connection", (socket) => {
  //ユーザーが接続してきた時の処理
  console.log("connect to User:", socket.client.id);
  userlist[socket.client.id] = {
    id: socket.client.id,
    name: `noname`,
    room: socket.client.id,
  };
  socket.on("endtimer", (msg) => {
    io.to(userlist[socket.client.id].room).emit("endtimer");
  });
  socket.on("chatMessage", (msg) => {
    io.to(userlist[socket.client.id].room).emit("chatMessage", msg);
  });
  socket.on("loginroom", (msg) => {
    console.log("join to User:", msg.name, msg.room);
    if (!roomstorage.hasOwnProperty(msg.room)) {
      roomstorage[msg.room] = { isVoting: false };
    }
    socket.join(msg.room);
    userlist[socket.client.id] = {
      id: socket.client.id,
      name: msg.name,
      room: msg.room,
    };
    let loginuser = {
      id: socket.client.id,
      name: msg.name,
      room: msg.room,
      userlist: getUserByRoom(msg.room),
    };
    io.to(socket.client.id).emit("loginroom", loginuser);
    io.to(msg.room).emit("addMember", loginuser);
    io.to(userlist[socket.client.id].room).emit("chatMessage", {
      name: loginuser.room,
      message: `[${loginuser.name}]がログインしました。`,
    });
  });
  socket.on("disconnect", (msg) => {
    console.log("disconnect to User:", socket.client.id);
    let logoutuser = {
      id: userlist[socket.client.id].id,
      name: userlist[socket.client.id].name,
      room: userlist[socket.client.id].room,
    };
    delete userlist[socket.client.id];
    logoutuser.userlist = getUserByRoom(logoutuser.room);
    io.to(logoutuser.room).emit("removeMember", logoutuser);
    io.to(logoutuser.room).emit("chatMessage", {
      name: logoutuser.room,
      message: `[${logoutuser.name}]がログアウトしました。`,
    });
    if (Object.values(getUserByRoom(logoutuser.room)).length == 0) {
      delete roomstorage[logoutuser.room];
    } else {
      if (roomstorage[logoutuser.room].isVoting) {
        voteCheck(logoutuser.room);
      }
    }
  });
});
let getUserByRoom = (room) => {
  let roomuser = {};
  Object.keys(userlist).forEach((key) => {
    if (room == userlist[key].room) {
      roomuser[key] = userlist[key];
    }
  });
  return roomuser;
};
io.on("connection", (socket) => {
  socket.on("wordwolf_start", (msg) => {
    startww(userlist[socket.client.id].room, socket.client.id, msg.sec);
  });
  socket.on("wordwolf_check", (msg) => {
    checkww(userlist[socket.client.id].room);
  });
  socket.on("wordwolf_anser", (msg) => {
    anserww(userlist[socket.client.id].room);
  });
});
let startww = (room, ownerId, sec) => {
  let roomusers = getUserByRoom(room);
  let pwordlist = [];
  let theme = ww.getWord();
  let majorityword = theme.majorityword;
  let minorityword = theme.minorityword;
  for (let i = 0; i < Object.keys(roomusers).length - 1; i++) {
    pwordlist.push({ word: majorityword, iswolf: "市民" });
  }
  pwordlist.push({ word: minorityword, iswolf: "ウルフ" });
  pwordlist = arrayShuffle(pwordlist);
  Object.keys(roomusers).forEach((value, i) => {
    io.to(value).emit("wordwolf", {
      name: "お題",
      message: pwordlist[i],
      id: ownerId,
    });
    roomusers[value].word = pwordlist[i].word;
    roomusers[value].iswolf = pwordlist[i].iswolf;
  });
  io.to(room).emit("starttimer", { sec: sec });
};
let checkww = (room) => {
  let roomusers = getUserByRoom(room);
  Object.keys(roomusers).forEach((value, i) => {
    let result = {
      id: roomusers[value].id,
      name: roomusers[value].name,
      iswolf: roomusers[value].iswolf,
    };
    io.to(room).emit("worldwolf_message", result);
  });
};
let anserww = (room) => {
  let roomusers = getUserByRoom(room);
  voteEnd(room);
  Object.keys(roomusers).forEach((value, i) => {
    let result = {
      id: roomusers[value].id,
      name: roomusers[value].name,
      iswolf: roomusers[value].iswolf,
      word: roomusers[value].word,
    };
    io.to(room).emit("worldwolf_message", result);
  });
};
let arrayShuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    var r = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
};

/**
 * Vote
 */
const votetimeout = 60000;
io.on("connection", (socket) => {
  socket.on("voteReq", (obj) => {
    voteStart(userlist[socket.client.id].room);
  });
  socket.on("voteDone", (obj) => {
    userlist[socket.client.id].vote = true;
    userlist[socket.client.id].votestatus = userlist[obj.votestatus].name;
    userlist[obj.votestatus].votes++;
    let room = userlist[socket.client.id].room;
    if (voteCheck(room)) {
      voteEnd(room);
    } else {
      roomstorage.timeout = setTimeout(() => {
        clearTimeout(roomstorage.timer);
        voteEnd(room);
      }, votetimeout);
    }
  });
  socket.on("loginroom", (msg) => {
    if (roomstorage[msg.room].isVoting) {
      userlist[socket.client.id].vote = false;
      userlist[socket.client.id].votestatus = "";
      userlist[socket.client.id].votes = 0;
      io.to(socket.client.id).emit("vote");
    }
  });
});
function voteStart(room) {
  let roomusers = getUserByRoom(room);
  if (roomstorage[room].isVoting == undefined) {
    roomstorage[room].isVoting = false;
  }
  if (!roomstorage[room].isVoting) {
    let data = {
      sender: "server",
      title: "voteStart",
    };
    Object.values(roomusers).forEach(function (user, i) {
      user.vote = false;
      user.votestatus = "";
      user.votes = 0;
    });
    roomstorage[room].isVoting = true;
    io.to(room).emit("vote", data);
  }
}
function voteCheck(room) {
  let roomusers = getUserByRoom(room);
  let endVote = true;
  Object.values(roomusers).forEach(function (con, i) {
    console.log(`[log]CHECK:${con.id}:${con.vote}`);
    if (!con.vote) {
      endVote = false;
    }
  });
  return endVote;
}
function voteEnd(room) {
  if (!roomstorage.hasOwnProperty(room)) {
    return;
  }
  clearTimeout(roomstorage[room].timeout);
  clearTimeout(roomstorage[room].timer);
  if (roomstorage[room].isVoting) {
    let voteresult = {};
    Object.values(getUserByRoom(room)).forEach((con, i) => {
      voteresult[con.id] = {};
      voteresult[con.id].id = con.id;
      voteresult[con.id].name = con.name;
      voteresult[con.id].vote = con.vote;
      voteresult[con.id].votestatus = con.votestatus;
      voteresult[con.id].votes = con.votes;
    });
    roomstorage[room].isVoting = false;
    io.to(room).emit("voteEnd", voteresult);
    checkww(room);
  }
}
