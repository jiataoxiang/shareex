const axios = require("axios");

// test create post with attachments
const attachments = [
  {
    type: "text1",
    body: "body1"
  },
  {
    type: "text2",
    body: "body2"
  }
];

const title = "title";
const author = "huakun";
const category = "test";
const body = "body";

// axios
//   .post("http://localhost:5000/posts", {
//     title: title,
//     author: author,
//     category: category,
//     body: body,
//     attachments: attachments
//   })
//   .then(res => {
//     console.log(res);
//   });

// get posts with filter
axios
  .get("http://localhost:5000/posts", {
    params: { category: "test" }
  })
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err);
  });
