class WordWolf {
  constructor(word, tag) {
    this.word = word;
    this.tag = tag;
  }
}
let wordlist = [];
let getThemeByTag = (tag) => {
  let themeList = [];
  wordlist.forEach((theme) => {
    if (theme.tag.indexOf(tag) != -1) {
      themeList.push(theme.word);
    }
  });
  return themeList;
};
let getWord = () => {
  let random = Math.floor(Math.random() * wordlist.length);
  let themeTags = wordlist[random].tag;
  let themeTagrnd = Math.floor(Math.random() * themeTags.length);
  let themeTag = wordlist[random].tag[themeTagrnd];
  let themelist = arrayShuffle(getThemeByTag(themeTag));
  //タグにあるワードが少ないときの警告
  if (themelist.length <= 2) {
    console.log(`[Warning]ThemeTag needs more word(${themeTag}) `);
    themelist.push(wordlist[random + 1].word);
  }
  let result = {
    majorityword: themelist[0],
    minorityword: themelist[1],
  };
  return result;
};
let arrayShuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    var r = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
};

wordlist.push(new WordWolf("カブトムシ", ["昆虫"]));
wordlist.push(new WordWolf("クワガタムシ", ["昆虫"]));
wordlist.push(new WordWolf("カマキリ", ["昆虫"]));
wordlist.push(new WordWolf("バッタ", ["昆虫"]));
wordlist.push(new WordWolf("セミ", ["昆虫"]));
wordlist.push(new WordWolf("トンボ", ["昆虫"]));

wordlist.push(new WordWolf("ファミリーレストラン", ["飲食店", "街にある"]));
wordlist.push(new WordWolf("カフェ", ["飲食店", "街にある"]));
wordlist.push(new WordWolf("ファーストフード", ["飲食店", "街にある"]));
wordlist.push(new WordWolf("フードコート", ["飲食店"]));
wordlist.push(new WordWolf("屋台", ["飲食店"]));
wordlist.push(new WordWolf("居酒屋", ["飲食店"]));

wordlist.push(new WordWolf("おはよう", ["あいさつ"]));
wordlist.push(new WordWolf("おやすみ", ["あいさつ"]));
wordlist.push(new WordWolf("おつかれさまです", ["あいさつ"]));
wordlist.push(new WordWolf("よろしく", ["あいさつ"]));
wordlist.push(new WordWolf("ごめんね", ["あいさつ"]));
wordlist.push(new WordWolf("ありがとう", ["あいさつ"]));

wordlist.push(new WordWolf("冷蔵庫", ["家電"]));
wordlist.push(new WordWolf("洗濯機", ["家電"]));
wordlist.push(new WordWolf("炊飯器", ["家電"]));
wordlist.push(new WordWolf("電子レンジ", ["家電"]));
wordlist.push(new WordWolf("掃除機", ["家電"]));

wordlist.push(new WordWolf("相撲", ["日本文化"]));
wordlist.push(new WordWolf("柔道", ["日本文化"]));
wordlist.push(new WordWolf("空手", ["日本文化"]));
wordlist.push(new WordWolf("歌舞伎", ["日本文化"]));

wordlist.push(new WordWolf("告白", ["青春"]));
wordlist.push(new WordWolf("失恋", ["青春"]));
wordlist.push(new WordWolf("部活", ["青春"]));
wordlist.push(new WordWolf("アルバイト", ["青春"]));
wordlist.push(new WordWolf("文化祭", ["青春"]));
wordlist.push(new WordWolf("体育祭", ["青春"]));

wordlist.push(new WordWolf("シーソー", ["公園"]));
wordlist.push(new WordWolf("ブランコ", ["公園"]));
wordlist.push(new WordWolf("すべり台", ["公園"]));
wordlist.push(new WordWolf("鉄棒", ["公園"]));
wordlist.push(new WordWolf("ジャングルジム", ["公園"]));
wordlist.push(new WordWolf("うんてい", ["公園"]));

wordlist.push(new WordWolf("自転車", ["交通"]));
wordlist.push(new WordWolf("自動車", ["交通"]));
wordlist.push(new WordWolf("電車", ["交通"]));
wordlist.push(new WordWolf("バス", ["交通"]));
wordlist.push(new WordWolf("飛行機", ["交通"]));
wordlist.push(new WordWolf("船", ["交通"]));

wordlist.push(new WordWolf("まじめ", ["性格"]));
wordlist.push(new WordWolf("負けず嫌い", ["性格"]));
wordlist.push(new WordWolf("努力家", ["性格"]));
wordlist.push(new WordWolf("ネガティブ", ["性格"]));
wordlist.push(new WordWolf("マイペース", ["性格"]));
wordlist.push(new WordWolf("アクティブ", ["性格"]));
wordlist.push(new WordWolf("ドS", ["性格"]));
wordlist.push(new WordWolf("ヤンデレ", ["性格"]));
wordlist.push(new WordWolf("ツンデレ", ["性格"]));
wordlist.push(new WordWolf("クーデレ", ["性格"]));

wordlist.push(new WordWolf("コンビニ", ["街にある"]));
wordlist.push(new WordWolf("スーパー", ["街にある"]));
wordlist.push(new WordWolf("病院", ["街にある"]));
wordlist.push(new WordWolf("美容院", ["街にある"]));
wordlist.push(new WordWolf("郵便局", ["街にある"]));
wordlist.push(new WordWolf("銀行", ["街にある"]));

wordlist.push(new WordWolf("国語", ["勉強科目"]));
wordlist.push(new WordWolf("算数", ["勉強科目"]));
wordlist.push(new WordWolf("理科", ["勉強科目"]));
wordlist.push(new WordWolf("社会科", ["勉強科目"]));
wordlist.push(new WordWolf("図工", ["勉強科目"]));
wordlist.push(new WordWolf("体育", ["勉強科目"]));

wordlist.push(new WordWolf("海水浴", ["夏のイベント"]));
wordlist.push(new WordWolf("プール", ["夏のイベント"]));
wordlist.push(new WordWolf("スイカ割り", ["夏のイベント"]));
wordlist.push(new WordWolf("バーベキュー", ["夏のイベント"]));
wordlist.push(new WordWolf("お祭り", ["夏のイベント"]));
wordlist.push(new WordWolf("花火", ["夏のイベント"]));
wordlist.push(new WordWolf("肝試し", ["夏のイベント"]));

wordlist.push(new WordWolf("タンバリン", ["楽器"]));
wordlist.push(new WordWolf("カスタネット", ["楽器"]));
wordlist.push(new WordWolf("鈴", ["楽器"]));
wordlist.push(new WordWolf("トライアングル", ["楽器"]));
wordlist.push(new WordWolf("リコーダー", ["楽器"]));
wordlist.push(new WordWolf("ハーモニカ", ["楽器"]));

wordlist.push(new WordWolf("トマト", ["野菜"]));
wordlist.push(new WordWolf("ピーマン", ["野菜"]));
wordlist.push(new WordWolf("人参", ["野菜"]));
wordlist.push(new WordWolf("大根", ["野菜"]));
wordlist.push(new WordWolf("キャベツ", ["野菜"]));
wordlist.push(new WordWolf("玉ねぎ", ["野菜"]));

wordlist.push(new WordWolf("サッカー", ["スポーツ"]));
wordlist.push(new WordWolf("野球", ["スポーツ"]));
wordlist.push(new WordWolf("バレーボール", ["スポーツ"]));
wordlist.push(new WordWolf("ラグビー", ["スポーツ"]));
wordlist.push(new WordWolf("バスケットボール", ["スポーツ"]));
wordlist.push(new WordWolf("卓球", ["スポーツ"]));

wordlist.push(new WordWolf("チョコレート", ["お菓子"]));
wordlist.push(new WordWolf("キャラメル", ["お菓子"]));
wordlist.push(new WordWolf("ビスケット", ["お菓子"]));
wordlist.push(new WordWolf("ケーキ", ["お菓子"]));
wordlist.push(new WordWolf("クッキー", ["お菓子"]));
wordlist.push(new WordWolf("パイ", ["お菓子"]));

wordlist.push(new WordWolf("スクワット", ["筋トレ"]));
wordlist.push(new WordWolf("プランク", ["筋トレ"]));
wordlist.push(new WordWolf("腹筋", ["筋トレ"]));
wordlist.push(new WordWolf("懸垂", ["筋トレ"]));
wordlist.push(new WordWolf("ダンベル上げ", ["筋トレ"]));
wordlist.push(new WordWolf("腕立て伏せ", ["筋トレ"]));
wordlist.push(new WordWolf("ランニング", ["筋トレ", "スポーツ"]));

wordlist.push(new WordWolf("ApexLegends", ["FPS"]));
wordlist.push(new WordWolf("Rainbow six siege", ["FPS"]));
wordlist.push(new WordWolf("カウンターストライク", ["FPS"]));
wordlist.push(new WordWolf("バトルフィールド", ["FPS"]));
wordlist.push(new WordWolf("オーバーウォッチ", ["FPS"]));
wordlist.push(new WordWolf("Call of Duty", ["FPS"]));
wordlist.push(new WordWolf("フォートナイト", ["FPS"]));

wordlist.push(new WordWolf("刀剣乱舞", ["ソシャゲ"]));
wordlist.push(new WordWolf("艦隊これくしょん", ["ソシャゲ"]));
wordlist.push(
  new WordWolf("グランブルーファンタジー", ["ソシャゲ", "サイゲームス"])
);
wordlist.push(new WordWolf("Fate/Grand Order", ["ソシャゲ"]));
wordlist.push(new WordWolf("パズドラ", ["ソシャゲ"]));
wordlist.push(
  new WordWolf("ツイステットワンダーランド", [
    "ゲーム",
    "ソシャゲ",
    "ディズニー",
  ])
);
wordlist.push(new WordWolf("ツムツム", ["ソシャゲ", "ディズニー"]));

wordlist.push(new WordWolf("美女と野獣", ["ディズニー"]));
wordlist.push(new WordWolf("シンデレラ", ["ディズニー"]));
wordlist.push(new WordWolf("アラジン", ["ディズニー"]));

wordlist.push(new WordWolf("シャドウバース", ["ソシャゲ", "サイゲームス"]));
wordlist.push(new WordWolf("神撃のバハムート", ["ソシャゲ", "サイゲームス"]));
wordlist.push(new WordWolf("ワールドフリッパー", ["ソシャゲ", "サイゲームス"]));
wordlist.push(new WordWolf("プリンセスコネクト", ["ソシャゲ", "サイゲームス"]));
wordlist.push(new WordWolf("ツムツム", ["ソシャゲ", "ディズニー"]));
wordlist.push(
  new WordWolf("ドラゴンクエストシリーズ", ["スクエアエニックス", "RPG"])
);
wordlist.push(
  new WordWolf("ファイナルファンタジーシリーズ", ["スクエアエニックス", "RPG"])
);
wordlist.push(
  new WordWolf("キングダムハーツシリーズ", ["スクエアエニックス", "RPG"])
);
wordlist.push(new WordWolf("ポケットモンスター", ["RPG"]));

wordlist.push(new WordWolf("烏龍茶", ["飲み物", "お茶"]));
wordlist.push(new WordWolf("緑茶", ["飲み物", "お茶"]));
wordlist.push(new WordWolf("ほうじ茶", ["飲み物", "お茶"]));
wordlist.push(new WordWolf("紅茶", ["飲み物", "お茶"]));
wordlist.push(new WordWolf("麦茶", ["飲み物", "お茶"]));
wordlist.push(new WordWolf("ジャスミン茶", ["飲み物", "お茶"]));

wordlist.push(new WordWolf("水瀬いのり", ["女性声優", "歌手"]));
wordlist.push(new WordWolf("佐倉綾音", ["女性声優", "歌手"]));
wordlist.push(new WordWolf("花澤香菜", ["女性声優", "歌手"]));
wordlist.push(new WordWolf("小倉唯", ["女性声優", "歌手"]));

wordlist.push(new WordWolf("花江夏樹", ["男性声優", "声優", "YouTuber"]));
wordlist.push(new WordWolf("杉田智一", ["男性声優", "声優"]));
wordlist.push(new WordWolf("木村昴", ["男性声優", "声優"]));

wordlist.push(new WordWolf("ヒカキン", ["YouTuber"]));
wordlist.push(new WordWolf("はじめしゃっちょー", ["YouTuber"]));

wordlist.push(new WordWolf("Twitter", ["SNS"]));
wordlist.push(new WordWolf("LINE", ["SNS"]));
wordlist.push(new WordWolf("FaceBook", ["SNS"]));
wordlist.push(new WordWolf("Instagram", ["SNS"]));
wordlist.push(new WordWolf("mixi", ["SNS"]));

wordlist.push(new WordWolf("ラーメン", ["麺類"]));
wordlist.push(new WordWolf("そば", ["麺類"]));
wordlist.push(new WordWolf("うどん", ["麺類"]));
wordlist.push(new WordWolf("そうめん", ["麺類"]));
wordlist.push(new WordWolf("スパゲッティ", ["麺類"]));
wordlist.push(new WordWolf("やきそば", ["麺類"]));

module.exports.wordlist = wordlist;
module.exports.getWord = getWord;
