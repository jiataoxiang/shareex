const mongoose = require('mongoose');
const config = require('config');
// turn on debug mode, turn it off for production build
// mongoose.set("debug", true);
const mongo_db_URI = config.get('mongoURI');
mongoose.connect(mongo_db_URI, { useNewUrlParser: true }).then(
  () => {
    console.log(
      '\n\n\n--------------------\nMongoose connected to DB\n--------------------\n\n\n'
    );
  },
  err => {
    console.log('Mongoose connection Error: ', err);
  }
);
