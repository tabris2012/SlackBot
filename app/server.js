const express = require('express');
const bodyParser = require('body-parser'); //Need for parse content-type
const request = require('request');
const config = require('config');
const slack = require('slack');

const app = express();
const port = 8040;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const clientId = config.slack.clientId;
const clientSecret = config.slack.clientSecret;

app.get('/', (req, res) => {
  res.send('Ngrok is working. Path Hit: ' + req.url);
})

app.get('/oauth', (req,res) => {
  // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
  if (!req.query.code) {
    res.status(500);
    res.send({"Error": "Looks like we're not getting code."});
    console.log("Looks like we're not getting code.");
  } else {
      // If it's there...

      // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
      request({
          url: 'https://slack.com/api/oauth.access', //URL to hit
          qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
          method: 'GET', //Specify the method

      }, function (error, response, body) {
          if (error) {
              console.log(error);
          } else {
              res.json(body);
          }
      })
  }
})

app.post('/say', (req, res) => {
  console.log(req.body);
  slack.chat.postMessage({
    token: config.slack.OAuthAccessToken,
    channel: req.body.channel_id,
    text: req.body.text,
  })
  res.status(200).send(""); // this command doesn't need to post anything back
})


app.listen(port, () => {
  console.log("App has been started on port " + port);
})