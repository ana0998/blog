var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//---Creare baza de date pentru postarile blogului---//
/*MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("BlogDB");
  dbo.createCollection("posts", function(err, res) {
    if (err) throw err;
    console.log("Data base and collection created");
    db.close();
  });
});*/


//---Creare baze de date pentru postarile altor persoane----///
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("StoryDB");
  dbo.createCollection("stories", function(err, res) {
    if (err) throw err;
    console.log("Data base and collection created");
    db.close();
  });
});