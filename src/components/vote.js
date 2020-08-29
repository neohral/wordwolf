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
      voteResult: {},
    };
  }
  componentDidMount() {
    socket.on("vote", (obj) => {
      this.setState({
        isVoting: true,
        votestatus: Object.values(this.props.userlist)[0].name,
        voteResult: {},
      });
    });
    socket.on("voteEnd", (obj) => {
      console.log("voteEnd");
      console.log(obj);
      this.setState({ isVoting: false, voteResult: obj });
    });
  }
  votestart() {
    console.log(this.props.userlist);
    socket.emit("voteReq");
  }
  votesend() {
    socket.emit("voteDone", {
      votestatus: this.state.votestatus,
    });
    this.setState({ isVoting: false });
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
    const result = Object.values(this.state.voteResult).map((e) => (
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
        <div id="log">{theme}</div>
        {votetag}
        投票結果
        <br />
        {result}
      </div>
    );
  }
}
export default Form;
