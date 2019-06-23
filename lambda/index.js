'use strict';
var Alexa = require('alexa-sdk');
/**
 * :tellを送ることで、スキルから明示的にセッションを終了
 * :askを送ることで対話を続けることができる
 * ユーザーから適切な応答がない場合、セッションは終了となり、SessionEndedRequestが送られてきます。
 * this.emit('インテント名'); これで他のインテント実行もできる
 */
var SKILL_NAME = "テスト実行"; //画面表示ヘッダー
var GET_FACT_MESSAGE = "はい。"; //音声で返す用のメッセージ
var HELP_MESSAGE = "名前を教えておくれ";
var HELP_REPROMPT = "どうしますか？";
var STOP_MESSAGE = "バイバイ！またあいさつしに来てくださいね。";
var RESULT = "こんにちは"; //表示用のメッセージ
let count = 0;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        //インテント指定なしの呼び出し
        this.emit(':ask', HELP_MESSAGE);
    },
    'NameIntent': function () {
        var userName = this.event.request.intent.slots.userName.value;
        this.emit(':ask', userName + "。贅沢な名だねぇ。今からおまえの名前は、" + userName.slice(0, -1) + "だ。いいかい、" + userName.slice(0, -1) + "だよ。分かったら返事をするんだ、" + userName.slice(0, -1) + "！！");
    },
    'SessionEndedRequest': function () {
        //明示的ではない終了
        if (this.event.request.error) {
            const error = this.event.request.error;
            console.log("😂 type:" + error.type + " message:" + error.message);
        }
        this.emit(':tell', '終了します');
    },
    'Unhandled': function () {
        this.emit(':tell', '予期せぬ応答です。');
    },
    'GetNewFactIntent': function () {

        this.emit(':askWithCard', GET_FACT_MESSAGE + RESULT, SKILL_NAME, RESULT)
    },
    'GetHelloIntent': function () {
        process.env.TZ = 'Asia/Tokyo';
        var jikan = new Date();
        var hour = jikan.getHours();
        switch (true) {
            case hour > 9 && hour < 18:
                this.emit(':tell', hour + '時です。いまの時間はこんにちはですね。');
                break;
            case (hour > 0 && hour < 2) || (hour >= 18 || hour <= 24):
                this.emit(':tell', hour + '時です。いまの時間はこんばんはですね。');
                break;
            case hour >= 2 && hour <= 9:
                this.emit(':tell', hour + '時です。いまの時間はおはようですね。');
                break;
            default:
                this.emit('Unhandled');
                break;
        }
    },
    'CounterIntent': function () {
        //自作
        count += 1;
        this.emit(':askWithCard', 'カウント' + count + "回目です。", SKILL_NAME, count)
    },
    'GetMeigenIntent': function () {
        //自作
        this.emit(':askWithCard', GET_FACT_MESSAGE + "名言が思いつきません。", SKILL_NAME, '名言が思いつきません。')
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        //明示的な終了
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        //明示的な終了
        this.emit(':tell', STOP_MESSAGE);
    }
};
