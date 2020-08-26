//https://qiita.com/kaitaku/items/1ddeabd5372bc635febd
import React, { Component } from "react";
import ChatForm from "./chatForm";
import WordWolf from "./wordwolf";
import socket from "./socket";
import UserManager from "./usermanager";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      name: "",
      isLoggedIn: false,
    };
    this.bindupdate = this.update.bind(this);
    //このcomponentで扱う配列logsの初期値を設定する
  }
  componentDidMount() {
    //このコンポーネントがDOMによって読み込まれた後の処理を設定する
    socket.on("chatMessage", (obj) => {
      console.log(obj);
      //WebSocketサーバーからchatMessageを受け取った際の処理
      const logs2 = this.state.logs;
      //logs2に今までのlogを格納する
      obj.key = "key_" + (this.state.logs.length + 1);
      //メッセージ毎に独自のキーを設定して判別できるようにする
      console.log(obj);
      //consolelogにobj.key、name、messageを表示する
      logs2.unshift(obj);
      //配列の一番最初に最新のメッセージを入れる。
      //そうすることで新しいメッセージほど上に表示されるようになる
      this.setState({ logs: logs2 });
      //最新のkey、name、messageが入ったlogs2をlogsに入れる。
    });
  }
  update(mystatus) {
    console.log(mystatus.name);
    this.setState({
      name: mystatus.name,
      isLoggedIn: true,
      room: mystatus.room,
    });
  }
  render() {
    const messages = this.state.logs.map((e) => (
      <div key={e.key}>
        <span>{e.name}</span>
        <span>: {e.message}</span>
        <p />
      </div>
    ));
    let logined;
    if (this.state.isLoggedIn) {
      logined = (
        <div>
          <WordWolf name={this.state.name} />
          <ChatForm name={this.state.name} />
          <div className="box2" id="log">
            {messages}
          </div>
        </div>
      );
    } else {
      logined = "";
    }
    //ログの設定。今までのname、messageをkeyごとに表示する
    return (
      <div>
        <h1 id="title">わーどうるふ</h1>
        <UserManager onEventLogin={this.bindupdate} name={this.state.name} />
        {logined}
      </div>
    );
  }
}

export default App;
