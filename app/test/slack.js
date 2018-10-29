const config = require('config');
const slack = require('slack');

postMessage = (channel, msg) => {
  slack.chat.postMessage({
    token: config.slack.OAuthAccessToken,
    channel: channel,
    text: msg
  })
}

const argChannel = process.argv[2];
const argMsg = process.argv[3];

postMessage(argChannel, argMsg);
