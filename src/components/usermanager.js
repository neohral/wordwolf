import React, { Component } from "react";
import io from "socket.io-client";
import socket from "./socket";

class UserManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      message: "",
      isLoggedIn: false,
      room: "",
      userlist: {},
      //このcomponentで扱うnameとmessageの初期値を設定する。
    };
  }
  roomChanged(e) {
    this.setState({ room: e.target.value });
  }
  nameChanged(e) {
    this.setState({ name: e.target.value });
  }
  componentDidMount() {
    //このコンポーネントがDOMによって読み込まれた後の処理を設定する
    socket.on("addMember", (obj) => {
      this.setState({ userlist: obj.userlist });
    });
    socket.on("removeMember", (obj) => {
      this.setState({ userlist: obj.userlist });
    });
    socket.on("loginroom", (obj) => {
      this.setState({ isLoggedIn: true });
      this.props.onEventLogin({ name: this.state.name, room: this.state.room });
      this.setState({ userlist: obj.userlist });
      console.log(this.state.userlist);
    });
  }
  //このイベントの発生時、this.state.messageにvalueの値が入る
  loginroom() {
    let re = /^( |　)*$/g;
    if (this.state.name != "" && !re.test(this.state.name)) {
      if (this.state.room == "" || re.test(this.state.room)) {
        this.state.room = "default";
      }
      socket.emit("loginroom", {
        name: this.state.name,
        room: this.state.room,
      });
    } else {
      alert("名前は必須");
    }
  }
  //このイベント発生時、socket.io-clientがlocahostにnameとmessageの値が入ったchatMessageを全てのユーザーに送信する。
  //その後、messageの値だけを初期値に戻す。

  render() {
    const messages = this.state.message;
    const users = Object.values(this.state.userlist).map((e) => (
      <li>{e.name}</li>
    ));
    let loginform = "";
    if (!this.state.isLoggedIn) {
      loginform = (
        <div className="box2" id="loginform">
          <div className="Room">
            部屋名:
            <br />
            <input
              value={this.state.room}
              onChange={(e) => this.roomChanged(e)}
            />
          </div>
          <div className="Name">
            名前:
            <br />
            <input
              value={this.state.name}
              onChange={(e) => this.nameChanged(e)}
            />
          </div>
          <button className="loginRoom" onClick={(e) => this.loginroom()}>
            入室
          </button>
        </div>
      );
    } else {
      loginform = (
        <div className="box2" id="loginform">
          部屋名:{this.state.room}
          <br />
          名前:{this.state.name}
        </div>
      );
    }
    return (
      <div id="Form">
        <div className="usermanager">
          <br />
          <ul>{users}</ul>
        </div>
        <div id="log">{loginform}</div>
      </div>
    );
  }
}
export default UserManager;
