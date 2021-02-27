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
      isGaming: false,
      voteResult:{},
      isVoted:false,
      winnerIsWolf:null
    };
    this.bindtimerend = this.timerend.bind(this);
  }
  componentDidMount() {
    socket.on("wordwolf", (obj) => {
      this.state.message = obj.message.word;
      this.setState({ message: this.state.message, wolfstat: {} });
      //お題主判定
      if (obj.id == socket.id) {
        this.setState({ isOwner: true });
      }
      this.setState({
        logs: [{ message: "----------------" }],
        isGaming: true,
        isVoted: false,
        winnerIsWolf: null
      });
    });
    socket.on("voteEnd", (obj) => {
      console.log("vote")
      this.setState({
        isVoted:true
      })
      Object.values(obj).map((e) => {
        if (!this.state.wolfstat.hasOwnProperty(e.id)) {
          this.state.wolfstat[e.id] = { name: "", iswolf: "", word: "???",votes:obj[e.id].votes };
        }
      }
      )
    });
    socket.on("worldwolf_message", (obj) => {
      if (!this.state.wolfstat.hasOwnProperty(obj.id)) {
        this.state.wolfstat[obj.id] = { name: "", iswolf: "", word: "???",votes:0 };
      }
      this.state.wolfstat[obj.id].name = obj.name;
      if (obj.hasOwnProperty("iswolf")) {
        this.state.wolfstat[obj.id].iswolf = obj.iswolf;
      }
      if (obj.hasOwnProperty("word")) {
        this.state.wolfstat[obj.id].word = obj.word;
        this.setState({ isGaming: false });
      }
      this.setState({ wolfstat: this.state.wolfstat });
      const logs2 = this.state.logs;
      logs2.push(obj);
      this.setState({ logs: logs2 });
      if(this.state.isVoted){
        this.setState({ winnerIsWolf: true });
        let maxVote = 0;
        Object.values(this.state.wolfstat).sort(function(a, b) {
          if (a.votes < b.votes) {
            return 1;
          } else {
            return -1;
          }
        }).map((e) => {
          if(maxVote<=e.votes){
            maxVote = e.votes;
            if(e.iswolf=="ウルフ"){
              this.setState({ winnerIsWolf: false });
            }
          }
        })
      }
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
    this.clickTimerend();
  }
  timerend() {
    if (this.state.isGaming) {
      socket.emit("voteReq");
    }
    this.clickTimerend();
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
    let winner = "";
    if(this.state.winnerIsWolf!=null){
      if(this.state.winnerIsWolf){
        winner = <div><font size="5">ウルフ（少数派）の勝利</font></div>
      }else{
        winner = <div><font size="5">市民（多数派）の勝利</font></div>
      }
    }
    const message = Object.values(this.state.wolfstat).sort(function(a, b) {
      if (a.votes < b.votes) {
        return 1;
      } else {
        return -1;
      }
    }).map((e) => (
      <div>
        <span>
          [{e.name}]({e.votes}票)は[{e.iswolf}]でお題は[{e.word}
          ]です。
        </span>
        <p />
      </div>
    ));
    let result;
    if (this.state.isOwner) {
      result = (
        <button className="btn" onClick={(e) => this.wolfanswer()}>
          答え
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
    let startbtn;
    if (!this.state.isGaming) {
      startbtn = (
        <button className="btn" onClick={(e) => this.wolfstart()}>
          ワードウルフスタート
        </button>
      );
    } else {
      startbtn = "";
    }
    return (
      <div id="Form">
        {winner}
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
          {startbtn}
          {stoptimer}
          {result}
        </div>
        <div className="box2">
          <div id="log">お題:{theme}</div>
          <div>{message}</div>
          <Timer onEventTimerCount={this.bindtimerend} />
        </div>
      </div>
    );
  }
}
export default WordWolf;
