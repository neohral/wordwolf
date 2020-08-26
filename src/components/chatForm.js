import React, { Component } from "react";
import socketio from "socket.io-client";
import socket from "./socket";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      message: "",
      inputRoom: "",
      room: "",
      //このcomponentで扱うnameとmessageの初期値を設定する。
    };
  }
  roomChanged(e) {
    this.setState({ inputRoom: e.target.value });
  }
  //このイベントの発生時、this.state.nameにvalueの値が入る
  messageChanged(e) {
    this.setState({ message: e.target.value });
  }
  //このイベントの発生時、this.state.messageにvalueの値が入る
  send() {
    socket.emit("chatMessage", {
      name: this.props.name,
      message: this.state.message,
    });
    this.setState({ message: "" });
  }
  sendroom() {
    this.setState({ room: this.state.inputRoom });
  }
  //このイベント発生時、socket.io-clientがlocahostにnameとmessageの値が入ったchatMessageを全てのユーザーに送信する。
  //その後、messageの値だけを初期値に戻す。

  render() {
    return (
      <div className="box2" id="Form">
        <div className="Message">
          メッセージ:
          <br />
          <input
            value={this.state.message}
            onChange={(e) => this.messageChanged(e)}
          />
        </div>
        <button className="send" onClick={(e) => this.send()}>
          送信
        </button>
      </div>
    );
  }
}

export default Form;
