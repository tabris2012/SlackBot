const config = require('config');
const slack = require('slack');
const moment = require('moment-timezone');

getChannelList = () => {
  return new Promise((onFulfilled, onRejected) => { //関数を同期化
    slack.channels.list({
      token: config.slack.OAuthAccessToken,
    }).then(response => {
      onFulfilled(response);
    });
  });
}

getChannel = (channel, oldest, latest) => {
  return new Promise((onFulfilled, onRejected) => { //関数を同期化
    slack.channels.history({
      token: config.slack.OAuthAccessToken,
      channel: channel, //channel id
      //oldest: oldest,
      //latest: latest
    }).then(response => {
      onFulfilled(response);
    });
  });
}

postMessage = (channel, msg) => {
  slack.chat.postMessage({
    token: config.slack.OAuthAccessToken,
    channel: channel, //postはチャンネル名でもいい
    text: msg
  })
}

// main
getChannelList().then(response => {
  console.log(response);
})

if (process.argv.length == 3) {
  const argChannel = process.argv[2];

  const oldest = moment().subtract(1, 'days').startOf('day');
  const latest = moment().startOf('day');

  getChannel(argChannel, oldest.unix(), latest.unix()).then(response => {
    console.log(response);
  })
} else if (process.argv.length == 4) {
  const argChannel = process.argv[2];
  const argMsg = process.argv[3];
  postMessage(argChannel, argMsg);
}

