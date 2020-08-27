const express = require("express");
const app = express();
const server = require("http").createServer(app);

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
    name: `you`,
    room: socket.client.id,
  };
  socket.on("chatMessage", (msg) => {
    io.to(userlist[socket.client.id].room).emit("chatMessage", msg);
  });
  socket.on("wordwolf_start", (msg) => {
    startww(userlist[socket.client.id].room, socket.client.id);
  });
  socket.on("wordwolf_check", (msg) => {
    checkww(userlist[socket.client.id].room);
  });
  socket.on("loginroom", (msg) => {
    console.log("join to User:", msg.name, msg.room);
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
class WordWolf {
  constructor(word, tag) {
    this.word = word;
    this.tag = tag;
  }
}
let wordlist = [];
wordlist.push(new WordWolf("バレーボール", "ビーチバレー"));
wordlist.push(new WordWolf("冬休み", "春休み"));
wordlist.push(new WordWolf("副業", "アルバイト"));
wordlist.push(new WordWolf("風呂掃除", "食器洗い"));
wordlist.push(new WordWolf("twitter", "Line"));
wordlist.push(new WordWolf("水族館", "動物園"));
wordlist.push(new WordWolf("ドラえもん", "ドラミちゃん"));
wordlist.push(new WordWolf("ファミレス", "カフェ"));
wordlist.push(new WordWolf("アルバイト面接", "就活"));
wordlist.push(new WordWolf("お年玉", "誕生日プレゼント"));
wordlist.push(new WordWolf("ガラケー", "固定電話"));
wordlist.push(new WordWolf("太陽", "月"));
wordlist.push(new WordWolf("マフラー", "手袋"));
wordlist.push(new WordWolf("エレベーター", "エスカレーター"));
wordlist.push(new WordWolf("コンビニ", "スーパー"));
wordlist.push(new WordWolf("海", "プール"));
wordlist.push(new WordWolf("年末", "年始"));
wordlist.push(new WordWolf("コンタクトレンズ", "メガネ"));
wordlist.push(new WordWolf("セロテープ", "ガムテープ"));
wordlist.push(new WordWolf("東京タワー", "スカイツリー"));
wordlist.push(new WordWolf("コップ", "グラス"));
wordlist.push(new WordWolf("カブトムシ", "クワガタ"));
wordlist.push(new WordWolf("飛行機", "新幹線"));
wordlist.push(new WordWolf("カレー", "シチュー"));
wordlist.push(new WordWolf("はさみ", "カッター"));
wordlist.push(new WordWolf("テニス", "卓球"));
wordlist.push(new WordWolf("スケート", "スキー"));
wordlist.push(new WordWolf("りす", "ハムスター"));
wordlist.push(new WordWolf("ぞう", "きりん"));
wordlist.push(new WordWolf("タクシー", "バス"));
wordlist.push(new WordWolf("セミ", "鈴虫"));
wordlist.push(new WordWolf("扇風機", "クーラー"));
wordlist.push(new WordWolf("ディズニーランド", "ＵＳＪ"));
wordlist.push(new WordWolf("浮き輪", "水中メガネ"));
wordlist.push(new WordWolf("洗濯機", "食洗機"));
wordlist.push(new WordWolf("ブランコ", "シーソー"));
wordlist.push(new WordWolf("水中メガネ", "浮き輪"));
wordlist.push(new WordWolf("目玉焼き", "スクランブルエッグ"));
wordlist.push(new WordWolf("鍋料理", "おでん"));
wordlist.push(new WordWolf("チョコレート", "キャラメル"));
wordlist.push(new WordWolf("コーヒー", "紅茶"));
wordlist.push(new WordWolf("日本酒", "ウィスキー"));
wordlist.push(new WordWolf("にんにく", "しょうが"));
wordlist.push(new WordWolf("白菜", "キャベツ"));
wordlist.push(new WordWolf("ゆで卵", "生卵"));
wordlist.push(new WordWolf("かき氷", "アイスクリーム"));
wordlist.push(new WordWolf("スイカ", "メロン"));
wordlist.push(new WordWolf("お茶漬け", "ふりかけ"));
wordlist.push(new WordWolf("塩", "砂糖"));
wordlist.push(new WordWolf("りんご", "なし"));
wordlist.push(new WordWolf("うどん", "そうめん"));
wordlist.push(new WordWolf("ポッキー", "トッポ"));
wordlist.push(new WordWolf("アンパン", "あんまん"));
wordlist.push(new WordWolf("幼稚園", "保育園"));
wordlist.push(new WordWolf("ボールペン", "シャープペン"));
wordlist.push(new WordWolf("ファミチキ", "からあげくん"));
wordlist.push(new WordWolf("青", "水色"));
wordlist.push(new WordWolf("ポイントカード", "クレジットカード"));
wordlist.push(new WordWolf("色鉛筆", "クレヨン"));
wordlist.push(new WordWolf("不倫", "浮気"));
wordlist.push(new WordWolf("トマトパスタ", "クリームパスタ"));
wordlist.push(new WordWolf("餃子", "シューマイ"));
wordlist.push(new WordWolf("友達", "親友"));
wordlist.push(new WordWolf("パチンコ", "スロット"));
wordlist.push(new WordWolf("石鹸", "ハンドソープ"));
wordlist.push(new WordWolf("レモン", "グレープフルーツ"));
wordlist.push(new WordWolf("スキー", "スノボー"));
wordlist.push(new WordWolf("コカコーラ", "ペプシ"));
wordlist.push(new WordWolf("野球", "ソフトボール"));
wordlist.push(new WordWolf("肉まん", "ピザまん"));
wordlist.push(new WordWolf("ポカリスエット", "アクエリアス"));
wordlist.push(new WordWolf("母乳", "牛乳"));
wordlist.push(new WordWolf("パンツ", "財布"));
wordlist.push(new WordWolf("初めてのおつかい", "初めてのキス"));
wordlist.push(new WordWolf("盆踊り", "ラジオ体操"));
wordlist.push(new WordWolf("痴漢", "鬼ごっこ"));
wordlist.push(new WordWolf("トランクス", "ブリーフ"));
wordlist.push(new WordWolf("おなら", "しゃっくり"));
wordlist.push(new WordWolf("1億円貰ったら", "10万円貰ったら"));
wordlist.push(new WordWolf("絵本", "エロ本"));

let startww = (room, ownerId) => {
  let roomusers = getUserByRoom(room);
  let random = Math.floor(Math.random() * wordlist.length);
  let pwordlist = [];
  let majorityword;
  let minorityword;
  let majorityrnd = Math.floor(Math.random() * 2);
  if (majorityrnd == 0) {
    majorityword = wordlist[random].word;
    minorityword = wordlist[random].tag;
  } else {
    majorityword = wordlist[random].tag;
    minorityword = wordlist[random].word;
  }
  for (let i = 0; i < Object.keys(roomusers).length - 1; i++) {
    pwordlist.push(majorityword);
  }
  pwordlist.push(minorityword);
  pwordlist = arrayShuffle(pwordlist);
  Object.keys(roomusers).forEach((value, i) => {
    io.to(value).emit("wordwolf", {
      name: "お題",
      message: pwordlist[i],
      id: ownerId,
    });
    roomusers[value].word = pwordlist[i];
  });
};
let checkww = (room) => {
  let roomusers = getUserByRoom(room);
  Object.keys(roomusers).forEach((value, i) => {
    io.to(room).emit("worldwolf_message", {
      message: `[${roomusers[value].name}]は[${roomusers[value].word}]`,
    });
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
