import React, { Component } from "react";
import io from "socket.io-client";
import socket from "./socket";
import Timer from "./timer";

class WordWolf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      ablecheck: false,
      logs: [],
    };
  }
  componentDidMount() {
    socket.on("wordwolf", (obj) => {
      this.state.message = obj.message.word;
      this.setState({ message: this.state.message });
      if (obj.id == socket.id) {
        this.setState({ ablecheck: true });
      }
      this.setState({ logs: [{ message: "----------------" }] });
    });
    socket.on("worldwolf_message", (obj) => {
      const logs2 = this.state.logs;
      logs2.push(obj);
      this.setState({ logs: logs2 });
    });
  }
  wolfstart() {
    socket.emit("wordwolf_start", {
      name: this.state.name,
      message: this.state.message,
    });
  }
  wolfanser() {
    this.setState({ ablecheck: false });
    socket.emit("wordwolf_anser");
  }
  timerend() {
    socket.emit("voteReq");
  }
  render() {
    const theme = this.state.message;
    const message = this.state.logs.map((e) => (
      <div>
        <span>{e.message}</span>
        <p />
      </div>
    ));
    let result;
    if (this.state.ablecheck) {
      result = (
        <div>
          <button className="send" onClick={(e) => this.wolfanser()}>
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
        <div id="log">お題:{theme}</div>
        <div>{message}</div>
        <Timer onEventTimerCount={this.timerend} />
      </div>
    );
  }
}
export default WordWolf;
