"use strict";

var fs =      require('fs'),
    http =    require('http'),
    _  =      require('lodash'),
    async =   require('async');

var index = function(req, res){

  fs.readFile('./views/home.html', function(error, data){
      var html            = _.template(data);

      res.writeHeader(200, {
         "Content-Type": "text/html"
      });

      res.end(html({

      }));
  });
};

var download = function(req, res){
  var play = req.body.play;
  console.log(play);

  var dir = "D:\\有声小说\\ximalaya\\" + play.albumName;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  var path = "D:\\有声小说\\ximalaya" + "\\" + play.albumName + "\\" + play.trackName + ".mp3";

  fs.access(path, fs.constants.F_OK, (err) => {
    if(err){
      console.log("File Doesn't Exist");
      var file = fs.createWriteStream(path);
      var request = http.get(play.src, function(response) {
        response.pipe(file);
      });
    } else {
      console.log("File Exists");
    }
  });
  res.json(true);
};

var downloadAll = function(req, res){
  var playlist = req.body.playlist;

  var dir = "D:\\有声小说\\ximalaya\\" + playlist[0].albumName;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  async.eachLimit(playlist, 5, function(play, callback) {
    var path = "D:\\有声小说\\ximalaya" + "\\" + play.albumName + "\\" + play.trackName + ".mp3";

    fs.access(path, fs.constants.F_OK, (err) => {
      if(err){
        console.log("File Doesn't Exist: start downloading: " + play.trackName);
        var file = fs.createWriteStream(path);
        var request = http.get(play.src, function(response) {
          response.pipe(file);
          file.on('finish', function() {
            console.log("File is doanloded: " + play.trackName);
            file.close(callback);  
          });
        }).on('error', function(err) {
          fs.unlink(path);
          if (callback) callback(err.message);
        });
      } else {
        console.log("File Exists");
        callback();
      }
    });
  });
  res.json(true);
};

module.exports = exports = {
  "index" :                index,
  "download" :             download,
  "downloadAll" :          downloadAll
};