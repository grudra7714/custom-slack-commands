const express = require('express')
const app = express()
const rp = require("request-promise");

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let token = process.env.slack_token;
console.log("slack_token", token);

const getJson = (reqData) => {
  return rp.post(reqData);
}

const randomImageRequest = (url) => {
  return rp(url);
}

const chuckNorrisRequest  = () => {
    return rp("https://api.chucknorris.io/jokes/random");
}

const chuckNorrisApi = async() => {
  return await chuckNorrisRequest();
}

const makeRequest = async() => {
  return await getJson();
}

const requestPost = async(endpoint, payload) => {
  console.log(token);

    var data = {
      url: 'https://slack.com/api/' + endpoint+'?token='+ token,
      formData: payload
    }

    return await getJson(data);
}

const meMessage = async(payload) => {
//    return this._post('chat.meMessage', {channel: channelId, text: text} );
  console.log("payload");
  console.log(payload);
  return await requestPost("chat.postMessage", payload);
}

app.post("/slack", (req, res) => {
  console.log("Hey");
});

app.post("/slack/events", (req, res) => {
  console.log("Slack events");
  console.log(req.body);
  res.send("ok");
  // res.send(req.body.challenge);
})

app.post("/", async(req, res) => {
  console.log("Post message received");
  console.log(req.body);
  let image = await randomImageRequest("https://source.unsplash.com/random");
  console.log("image");
  // console.log(image);

  let jokes = await chuckNorrisRequest();
  jokes = JSON.parse(jokes);
// attachments: JSON.stringify([{"pretext": "pre-hello", "image_url": "https://www.w3schools.com/w3css/img_lights.jpg"}])

  let response = await meMessage({channel: req.body.channel_id, text: jokes.value});
  console.log(response);
  // console.log(jokes);
  // var body = {
  //    response_type: "in_channel",
  //    attachments: [{
  //      text: jokes.value
  //    }]
  //  };
   //used if we dont wanna send any response
   res.end();
  // res.send(body);
});


app.get('/',  async(req, res) => {
  // let a = await makeRequest();
  // console.log(req.body.text)
  res.send("HEYA")
})


app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port ' + process.env.PORT || 3000);
})
