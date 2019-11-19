const User = require("../models/User");
const bcrypt = require("bcrypt");
require("../util/mongoose_connection"); // this line with connect to database

// delete all users
// User.deleteMany({}, err => {
//   console.log(err);
// });

// initialize some users
const salt = 10;

for (let i = 0; i < 10; i++) {
  const username = `user${i}`;
  const pwd = username;
  bcrypt.hash(pwd, salt).then(hash => {
    User.create({
      username: username,
      password: hash
    })
      .then(user => {
        console.log(user);
        // Compare password
        // user.comparePassword(pwd, function(err, isMatch) {
        //   if (err) throw err;
        //   console.log(`Password: ${pwd} is `, isMatch);
        // });
      })
      .catch(err => {
        console.log(err);
      });
  });
}
