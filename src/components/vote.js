import React, { Component } from "react";
import io from "socket.io-client";
import socket from "./socket";

class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      isVoting: false,
      votestatus: "",
      voteResult: {},
      voteto: "",
    };
  }
  componentDidMount() {
    socket.on("vote", (obj) => {
      this.setState({
        isVoting: true,
        votestatus: Object.values(this.props.userlist)[0].id,
        voteResult: {},
        voteto: "",
      });
    });
    socket.on("voteEnd", (obj) => {
      this.setState({ isVoting: false, voteResult: obj });
    });
  }
  votestart() {
    socket.emit("voteReq");
  }
  votesend() {
    socket.emit("voteDone", {
      votestatus: this.state.votestatus,
    });
    this.setState({
      isVoting: false,
      voteto: `(投票先→${this.props.userlist[this.state.votestatus].name})`,
    });
  }
  OnChangeEvent(e) {
    this.setState({ votestatus: e.target.value });
  }
  render() {
    const theme = this.state.message;
    const message = Object.values(this.props.userlist).map((e) => (
      <option value={e.id}>{e.name}</option>
    ));
    const result = Object.values(this.state.voteResult).sort(function(a, b) {
      if (a.votes < b.votes) {
        return 1;
      } else {
        return -1;
      }
    }).map((e) => (
      <div>
        <span>
          {e.name}→{e.votestatus}
        </span>
        <p />
      </div>
    ));
    let votetag;
    if (this.state.isVoting) {
      votetag = (
        <div>
          <select
            id="holo"
            value={this.state.votestatus}
            onChange={(event) => this.OnChangeEvent(event)}
          >
            {message}
          </select>
          <button className="btn" onClick={(e) => this.votesend()}>
            投票
          </button>
        </div>
      );
    } else {
      votetag = "";
    }
    return (
      <div className="box2" id="Form">
        <div id="log">{theme}</div>
        {votetag}
        投票結果 {this.state.voteto}
        <br />
        {result}
      </div>
    );
  }
}
export default Vote;
