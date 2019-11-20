const User = require("../models/User");
require("../util/mongoose_connection"); // this line with connect to database

const user = new User({
  username: "huakunshen",
  password: "huakunshen"
});
user.save();

User.create({
  username: "huakunshen2",
  password: "huakunshen"
});
