const mongoose = require("mongoose");
// turn on debug mode, turn it off for production build
mongoose.set("debug", true);
mongoose
  .connect(
    "mongodb+srv://dev:dev@shareex-36p7c.mongodb.net/shareex?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(
    () => {
      console.log(
        "\n\n\n--------------------\nMongoose connected to DB\n--------------------\n\n\n"
      );
    },
    err => {
      console.log("Mongoose connection Error: ", err);
    }
  );
