const User = require('../models/User');
require('../util/mongoose_connection'); // this line with connect to database

// const user = new User({
//   username: "huakunshen4",
//   password: "huakunshen"
// });
// user.save();

// User.create({
//   username: "huakunshen2",
//   password: "huakunshen"
// });

User.updateMany({ avatar: './img/banner.jpg' }, { $set: { avatar: '/img/banner.jpg' } })
  .then(users => {
    console.log(users);
  })
  .catch(err => {
    console.log(err);
  });
