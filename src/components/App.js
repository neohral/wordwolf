//https://qiita.com/kaitaku/items/1ddeabd5372bc635febd
import React, { Component } from "react";
import ChatForm from "./chatForm";
import WordWolf from "./wordwolf";
import socket from "./socket";
import UserManager from "./usermanager";
import Vote from "./vote";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      name: "",
      isLoggedIn: false,
      userlist: {},
    };
    //bindしないと子から呼び出した時にthisが取れない。
    this.bindlogin = this.login.bind(this);
    this.binduserlist = this.updateuserlist.bind(this);
  }
  componentDidMount() {
    socket.on("chatMessage", (obj) => {
      const logs2 = this.state.logs;
      obj.key = "key_" + (this.state.logs.length + 1);
      logs2.unshift(obj);
      this.setState({ logs: logs2 });
    });
  }
  login(mystatus) {
    this.setState({
      name: mystatus.name,
      isLoggedIn: true,
      room: mystatus.room,
    });
  }
  updateuserlist(obj) {
    this.setState({
      userlist: obj.userlist,
    });
  }
  render() {
    const messages = this.state.logs.map((e) => (
      <div key={e.key}>
        <span>{e.name}</span>
        <span>: {e.message}</span>
        <p />
      </div>
    ));
    let logined;
    if (this.state.isLoggedIn) {
      logined = (
        <div>
          <div className="box2">
            <br />
            <WordWolf name={this.state.name} />
            <Vote userlist={this.state.userlist} />
          </div>
          <ChatForm name={this.state.name} />
          <div className="box2" id="log">
            {messages}
          </div>
        </div>
      );
    } else {
      logined = "";
    }
    return (
      <div>
        <h1 id="title">わーどうるふ</h1>
        <UserManager
          onEventUserlist={this.binduserlist}
          onEventLogin={this.bindlogin}
          name={this.state.name}
        />
        {logined}
      </div>
    );
  }
}

export default App;
