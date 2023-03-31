const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// store posts locally so everytime change the code, the local storage will be cleaned, since I'm using nodemon
const posts = {};


// @route   GET /posts
// @desc    Get All Posts
app.get("/posts", (req, res) => {
  res.send(posts);
});


// @route   POST /posts
// @desc    Creat a post
// @body    {"title": string}
// @event   Send PostCreated to event-bus
app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});


// @route   POST /events
// @desc    Receieve a event
// @body   
app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});



