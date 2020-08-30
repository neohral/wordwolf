import React, { Component } from "react";
import io from "socket.io-client";
import socket from "./socket";
import Timer from "./timer";

class WordWolf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      isOwner: false,
      logs: [],
      wolfstat: {},
      isTimer: false,
      sec: 60 * 5,
    };
  }
  componentDidMount() {
    socket.on("wordwolf", (obj) => {
      this.state.message = obj.message.word;
      this.setState({ message: this.state.message, wolfstat: {} });
      //お題主判定
      if (obj.id == socket.id) {
        this.setState({ isOwner: true });
      }
      this.setState({ logs: [{ message: "----------------" }] });
    });
    socket.on("worldwolf_message", (obj) => {
      if (!this.state.wolfstat.hasOwnProperty(obj.id)) {
        this.state.wolfstat[obj.id] = { name: "", iswolf: "", word: "???" };
      }
      this.state.wolfstat[obj.id].name = obj.name;
      if (obj.hasOwnProperty("iswolf")) {
        this.state.wolfstat[obj.id].iswolf = obj.iswolf;
      }
      if (obj.hasOwnProperty("word")) {
        this.state.wolfstat[obj.id].word = obj.word;
      }
      this.setState({ wolfstat: this.state.wolfstat });
      const logs2 = this.state.logs;
      logs2.push(obj);
      this.setState({ logs: logs2 });
    });
    socket.on("starttimer", (obj) => {
      this.setState({ isTimer: true });
    });
    socket.on("endtimer", (obj) => {
      this.setState({ isTimer: false });
    });
  }
  wolfstart() {
    socket.emit("wordwolf_start", {
      name: this.state.name,
      message: this.state.message,
      sec: this.state.sec,
    });
  }
  wolfanswer() {
    this.setState({ isOwner: false });
    socket.emit("wordwolf_anser");
  }
  timerend() {
    socket.emit("voteReq");
  }
  clickTimerend() {
    socket.emit("endtimer");
  }
  secChanged(event) {
    let inputsec = event.target.value;
    if (isNaN(event.target.value)) {
      inputsec = 300;
    }
    this.setState({ sec: parseInt(inputsec) });
  }
  render() {
    const theme = this.state.message;
    const message = Object.values(this.state.wolfstat).map((e) => (
      <div>
        <span>
          [{e.name}]は[{e.iswolf}]でお題は[{e.word}
          ]です。
        </span>
        <p />
      </div>
    ));
    let result;
    if (this.state.isOwner) {
      result = (
        <button className="btn" onClick={(e) => this.wolfanswer()}>
          結果
        </button>
      );
    } else {
      result = "";
    }
    let stoptimer;
    if (this.state.isTimer && this.state.isOwner) {
      stoptimer = (
        <button className="btn" onClick={(e) => this.clickTimerend()}>
          タイマー終了
        </button>
      );
    } else {
      stoptimer = "";
    }
    return (
      <div id="Form">
        <div className="box2">
          ゲーム設定:
          <br />
          議論時間：
          <input
            className="timer"
            type="number"
            min="0"
            size="1"
            onChange={(e) => this.secChanged(e)}
          />
          秒
          <br />
          <button className="btn" onClick={(e) => this.wolfstart()}>
            大神みおーん
          </button>
          {stoptimer}
          {result}
        </div>
        <div className="box2">
          <div id="log">お題:{theme}</div>
          <div>{message}</div>
          <Timer onEventTimerCount={this.timerend} />
        </div>
      </div>
    );
  }
}
export default WordWolf;
