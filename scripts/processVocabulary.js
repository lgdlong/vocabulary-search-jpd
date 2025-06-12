// Script to process Japanese vocabulary data and generate JSON
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import wanakana from 'wanakana';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is a simplified approach. For real applications, you might want to use
// a more comprehensive Japanese text analysis library like kuromoji.js

// Example mapping for kanji to hiragana for some common verbs and words
const kanjiToHiraganaMap = {
  "話します": "はなします",
  "行きます": "いきます",
  "来ます": "きます",
  "会話": "かいわ",
  "社会": "しゃかい",
  "会います": "あいます",
  "買います": "かいます",
  "見ます": "みます",
  "読みます": "よみます",
  "飲みます": "のみます",
  "食べます": "たべます",
  "聞きます": "ききます",
  "新聞": "しんぶん",
  "書きます": "かきます",
  "日帰り": "ひがえり",
  "帰国": "きこく",
  "帰ります": "かえります",
  "起きます": "おきます",
  "弾きます": "ひきます",
  "出します": "だします",
  "毎朝": "まいあさ",
  "毎晩": "まいばん",
  "飲食": "いんしょく",
  "来日": "らいにち",
  "見学": "けんがく",
  "見物": "けんぶつ",
  "男": "おとこ",
  "女": "おんな",
  "学校": "がっこう",
  "大学": "だいがく",
  "時間": "じかん",
  "半": "はん",
  "時": "じ",
  "お寺": "おてら",
  "風邪": "かぜ",
  "料理": "りょうり",
  "明日": "あした",
  "毎日": "まいにち",
  "毎月": "まいつき",
  "毎週": "まいしゅう",
  "先月": "せんげつ",
  "先日": "せんじつ",
  "前日": "ぜんじつ",
  "一昨日": "おととい",
  "昨日": "きのう",
  "今日": "きょう",
  "明後日": "あさって",
  "来月": "らいげつ",
  "来年": "らいねん",
  "今年": "ことし",
  "去年": "きょねん",
  "先週": "せんしゅう",
  "週末": "しゅうまつ",
  "今週": "こんしゅう",
  "来週": "らいしゅう",
  "午後": "ごご",
  "午前": "ごぜん",
  "今晩": "こんばん",
  "今朝": "けさ",
  "昼": "ひる",
  "後前": "ぜんご",
  "市": "し",
  "町": "まち",
  "東": "ひがし",
  "西": "にし",
  "南": "みなみ",
  "北": "きた",
  "区": "く",
  "名前": "なまえ",
  "東京": "とうきょう",
  "京都": "きょうと",
  "食べ物": "たべもの",
  "高い": "たかい",
  "古い": "ふるい",
  "新しい": "あたらしい",
  "低い": "ひくい",
  "大きい": "おおきい",
  "小さい": "ちいさい",
  "安い": "やすい",
  "枚": "まい",
  "半年": "はんとし",
  "国会": "こっかい",
  "会社": "かいしゃ",
  "会議": "かいぎ",
  "会見": "かいけん",
  "歌手": "かしゅ",
  "肉": "にく",
  "有名": "ゆうめい",
  "休日": "きゅうじつ",
  "荷物": "にもつ",
  "食事": "しょくじ",
  "旅行": "りょこう",
  "国語": "こくご",
  "読み物": "よみもの",
  "読書": "どくしょ",
  "男女": "だんじょ",
  "名人": "めいじん",
  "料金": "りょうきん",
  "小学校": "しょうがっこう",
  "小人": "こびと",
  "大人": "おとな",
  "大会": "たいかい",
  "言語": "げんご",
  "野菜": "やさい",
  "門": "もん",
  "半ば": "なかば",
  "人物": "じんぶつ",
  "友達": "ともだち",
  "家": "いえ",
  "天気": "てんき",
  "山": "やま",
  "田": "た",
  "中": "なか",
  "川": "かわ",
  "雨": "あめ",
  "先": "さき"
};

// Read the existing vocabulary file
const vocabPath = path.join(__dirname, '..', 'src', 'data', 'vocabularies.json');
const vocabularies = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

// Process the vocabularies to add hiragana
const processedVocabularies = vocabularies.map(vocab => {
  if ((!vocab.hiragana || vocab.hiragana === "") && vocab.kanji) {
    // First check our map for exact matches
    if (kanjiToHiraganaMap[vocab.kanji]) {
      vocab.hiragana = kanjiToHiraganaMap[vocab.kanji];
    }
    // If not in our map, try a basic conversion (might not be accurate for all kanji)
    else {
      try {
        // This is simplified and might not work well for all kanji
        vocab.hiragana = wanakana.toHiragana(vocab.kanji);
      } catch (error) {
        console.error(`Error processing: ${vocab.kanji}`, error);
        vocab.hiragana = ""; // Set empty if conversion fails
      }
    }
  }
  return vocab;
});

// Write the updated vocabulary back to the file
fs.writeFileSync(vocabPath, JSON.stringify(processedVocabularies, null, 2), 'utf8');

console.log('Conversion completed successfully! Hiragana fields have been added to vocabularies.json');
