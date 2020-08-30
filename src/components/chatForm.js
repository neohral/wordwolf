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
    };
  }
  roomChanged(e) {
    this.setState({ inputRoom: e.target.value });
  }
  messageChanged(e) {
    this.setState({ message: e.target.value });
  }
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
        <button className="btn" onClick={(e) => this.send()}>
          送信
        </button>
      </div>
    );
  }
}

export default Form;
