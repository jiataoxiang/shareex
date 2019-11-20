const axios = require("axios");

function test() {
  axios
    .get("http://localhost:5000/hello")
    .then(res => {
      console.log(res.data.msg);
    })
    .catch(err => {
      console.log(err);
    });
}
// test();

async function asyncTest() {
  const data = await axios.get("http://localhost:5000/hello");
  console.log(data.data.msg);
}
// asyncTest();

async function asyncTestMany() {
  const arr = [];
  for (let i = 0; i < 10; i++) {
    const data = await axios.get("http://localhost:5000/hello");
    arr.push(data.data.msg);
  }
  console.log(arr);
}

function testMany() {
  for (let i = 0; i < 10; i++) {
    axios
      .get("http://localhost:5000/hello")
      .then(res => {
        console.log(res.data.msg);
      })
      .catch(err => {
        console.log(err);
      });
  }
  console.log("reached here");
}

testMany();
// asyncTestMany();
// axios
//   .get("http://localhost:5000/hello")
//   .then(res => {
//     console.log(res.data.msg);
//   })
//   .catch(err => {
//     console.log(err);
//   });
