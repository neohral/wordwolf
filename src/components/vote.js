import React, { Component } from "react";
import io from "socket.io-client";
import socket from "./socket";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      isVoting: false,
      votestatus: "",
    };
  }
  componentDidMount() {
    socket.on("vote", (obj) => {
      this.setState({
        isVoting: true,
        votestatus: Object.values(this.props.userlist)[0].name,
      });
    });
    socket.on("voteEnd", (obj) => {
      console.log("voteEnd");
      this.setState({ isVoting: false });
      console.log(obj);
    });
  }
  votestart() {
    console.log(this.props.userlist);
    socket.emit("voteReq", {
      name: this.state.name,
      message: this.state.message,
    });
  }
  votesend() {
    socket.emit("voteDone", {
      votestatus: this.state.votestatus,
    });
  }
  selonChange(e) {
    console.log(e.target.value);
    this.setState({ votestatus: e.target.value });
  }
  render() {
    const theme = this.state.message;
    const message = Object.values(this.props.userlist).map((e) => (
      <option value={e.name}>{e.name}</option>
    ));
    let votetag;
    if (this.state.isVoting) {
      votetag = (
        <div>
          <select
            id="holo"
            value={this.state.votestatus}
            onChange={(event) => this.selonChange(event)}
          >
            {message}
          </select>
          <button className="sends" onClick={(e) => this.votesend()}>
            投票
          </button>
        </div>
      );
    } else {
      votetag = "";
    }
    return (
      <div className="box2" id="Form">
        <button className="send" onClick={(e) => this.votestart(e)}>
          投票開始
        </button>
        <div id="log">{theme}</div>
        {votetag}
      </div>
    );
  }
}
export default Form;
