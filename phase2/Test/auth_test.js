const User = require("../models/User");
const bcrypt = require("bcrypt");
require("../util/mongoose_connection"); // this line with connect to database

// test creating a user with hashed password
// check database after running this

// const username = "user2";
// let pwd = "user2";
// const salt = 10;
// bcrypt.hash(pwd, salt).then(hash => {
//   User.create({
//     username: username,
//     password: hash
//   })
//     .then(user => {
//       console.log(user);
//       // Compare password
//       user.comparePassword(pwd, function(err, isMatch) {
//         if (err) throw err;
//         console.log(`Password: ${pwd} is `, isMatch);
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

// delete all users
// User.deleteMany({}, err => {
//   console.log(err);
// });

// compare password
bcrypt
  .compare(
    "huakun",
    "$2b$10$QXRaHF/dhP/.GHOfCrbFGO3aliJjLM3wQPUW64iUNnjuqHP0o3EM6"
  )
  .then(function(res) {
    console.log("\n\n", res, "\n\n");
  });
