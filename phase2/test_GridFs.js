//1. Load the mongoose driver

console.log(__dirname);
const mongooseDrv = require("mongoose");
//2. Connect to MongoDB and its database

mongooseDrv.connect("mongodb+srv://dev:dev@shareex-36p7c.mongodb.net/shareex?retryWrites=true&w=majority", {useNewUrlParser: true})
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
//3. The Connection Object
const connection = mongooseDrv.connection;
if (connection !== "undefined") {
  console.log(connection.readyState.toString());
  //4. The Path object
  const path = require("path");
  //5. The grid-stream
  const grid = require("gridfs-stream");
  //6. The File-System module
  const fs = require("fs");
  //7.Read the video/image file from the videoread folder
  const filesrc = path.join(__dirname, "./client/public/img/video.mp4");
  //8. Establish connection between Mongo and GridFS
  grid.mongo = mongooseDrv.mongo;
  //9.Open the connection and write file
  connection.once("open", () => {
    console.log("Connection Open");
    const gridfs = grid(connection.db);
    if (gridfs) {
      //9a. create a stream, this will be
      //used to store file in database
      const streamwrite = gridfs.createWriteStream({
        //the file will be stored with the name
        filename: "example.png"
      });
      //9b. create a readstream to read the file
      //from the filestored folder
      //and pipe into the database
      fs.createReadStream(filesrc).pipe(streamwrite);
      //9c. Complete the write operation
      streamwrite.on("close", function (file) {
        console.log("Write written successfully in database");
      });
    } else {
      console.log("Sorry No Grid FS Object");
    }
  });
} else {
  console.log('Sorry not connected');
}
console.log("done");