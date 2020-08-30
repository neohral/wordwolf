import React, { Component } from "react";
import socketio from "socket.io-client";
import socket from "./socket";

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sec: 5 * 60,
      message: "",
      isTimer: false,
      timerobj: () => {},
    };
  }
  componentDidMount() {
    socket.on("starttimer", (obj) => {
      this.starttimer(obj.sec);
    });
    socket.on("endtimer", (obj) => {
      if (this.state.isTimer) {
        this.endtimer();
      }
    });
  }

  starttimer(second) {
    this.setState({ isTimer: true, sec: second });
    clearInterval(this.state.timerobj);
    this.state.timerobj = setInterval(() => {
      this.setState({ sec: this.state.sec - 1 });
      if (this.state.sec <= 0) {
        this.endtimer();
      }
    }, 1000);
  }
  endtimer() {
    clearInterval(this.state.timerobj);
    this.setState({ isTimer: false });
    this.props.onEventTimerCount();
  }
  render() {
    const hour = ("00" + Math.floor(this.state.sec / 3600)).slice(-2);
    const minute = ("00" + (Math.floor(this.state.sec / 60) % 60)).slice(-2);
    const sec = ("00" + ((this.state.sec % 60) % 60)).slice(-2);
    let time;
    if (this.state.isTimer) {
      time = `${hour}:${minute}:${sec}`;
    } else {
      time = "";
    }
    return <div>{time}</div>;
  }
}

export default Timer;
