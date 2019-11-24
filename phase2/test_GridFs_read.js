var mongooseDrv = require("mongoose");
var schema = mongooseDrv.Schema;
mongooseDrv.connect('mongodb://localhost/filesDB', { useMongoClient: true });
var connection = mongooseDrv.connection;
if (connection !== "undefined") {
  console.log(connection.readyState.toString());
  var path = require("path");
  var grid = require("gridfs-stream");
  var fs = require("fs");
  var videosrc = path.join(__dirname, "./filestowrite/celibration.mp4");
  Grid.mongo = mongooseDrv.mongo;
  connection.once("open", () => {
    console.log("Connection Open");
    var gridfs = grid(example.db);
    if (gridfs) {
      var fsstreamwrite = fs.createWriteStream(
        path.join(__dirname, "./filestowrite/example.png")
      );
      var readstream = gridfs.createReadStream({
        filename: "example.png"
      });
      readstream.pipe(fsstreamwrite);
      readstream.on("close", function (file) {
        console.log("File Read successfully from database");
      });
    } else {
      console.log("Sorry No Grid FS Object");
    }
  });
} else {
  console.log('Sorry not connected');
}
console.log("done");