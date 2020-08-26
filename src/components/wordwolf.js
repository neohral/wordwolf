import React, { Component } from "react";
import io from "socket.io-client";
import socket from "./socket";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      ablecheck: false,
    };
  }
  componentDidMount() {
    socket.on("wordwolf", (obj) => {
      this.state.message = obj.message;
      this.setState({ message: this.state.message });
      console.log(obj.id, socket.id);
      if (obj.id == socket.id) {
        this.setState({ ablecheck: true });
      }
    });
  }
  wolfstart() {
    socket.emit("wordwolf_start", {
      name: this.state.name,
      message: this.state.message,
    });
  }
  wolfcheck() {
    this.setState({ ablecheck: false });
    socket.emit("wordwolf_check", {
      name: this.state.name,
      message: this.state.message,
    });
  }
  render() {
    const messages = this.state.message;
    let result;
    if (this.state.ablecheck) {
      result = (
        <div>
          <button className="send" onClick={(e) => this.wolfcheck()}>
            結果
          </button>
        </div>
      );
    } else {
      result = "";
    }
    return (
      <div className="box2" id="Form">
        <button className="send" onClick={(e) => this.wolfstart()}>
          大神みおーん
        </button>
        {result}
        <div id="log">結果:{messages}</div>
      </div>
    );
  }
}
export default Form;
