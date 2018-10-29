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

  var dir = "D:\\有声小说\\ximalaya\\" + play.albumName;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  var path = "D:\\有声小说\\ximalaya" + "\\" + play.albumName + "\\" + play.trackName + ".mp3";

  fs.access(path, fs.constants.F_OK, (err) => {
    if(err){
      console.log("File Doesn't Exist");
      var file = fs.createWriteStream(path);
      var downloadedSize = 0;
      var request = http.get(play.src, function(response) {
        downloadedSize = response.headers[ 'content-length' ];
        response.pipe(file);
      });
      file.on('finish', function () {
        if(downloadedSize == fs.statSync(path).size) {
          console.log("Size Match", path)
        } else {
          console.log("Size unmatch", path)
        }
      });
    } else {
      console.log("File Exists");
    }
  });
  res.json(true);
};

var downloadAll = function(req, res){
  var playlist = req.body.playlist;
  var unmatchedFileSizeList = [];

  async.eachLimit(playlist, 50, function(play, callback) {
    // Get albumName as folder path
    var dir = "D:\\有声小说\\ximalaya\\" + play.albumName;

    // Check if folder exsits
    fs.access(dir, fs.constants.F_OK, (err) => {
      // If folder doesn't exists
      if(err){
        fs.mkdir(dir, function(err){
          downloadFile(play, callback, unmatchedFileSizeList);
        });
        // If folder already exists
      } else {
        downloadFile(play, callback, unmatchedFileSizeList);
      }
    });
  }, function() {
    console.log("==================================================================================");
    console.log(unmatchedFileSizeList);
    console.log("==================================================================================");
  });
  res.json(true);
};

var downloadFile = function(play, callback, unmatchedFileSizeList) {
  var path = "D:\\有声小说\\ximalaya" + "\\" + play.albumName + "\\" + play.trackName.replace(/[/\\?%*:|"<>]/g, '-') + ".mp3";

  // Check if file already exists
  fs.access(path, fs.constants.F_OK, (err) => {
    // If file doesn't exist start downloading
    if(err){
      var file = fs.createWriteStream(path);
      var request = http.get(play.src, function(response) {
        response.pipe(file);
        var downloadedSize = response.headers[ 'content-length' ];
        file.on('finish', function() {
          if(downloadedSize == fs.statSync(path).size) {
            console.log("==================> Size Match", path)
          } else {
            console.log("Size unmatch", path)
            unmatchedFileSizeList.push(path);
          }
          file.close(callback);  
        });
      }).on('error', function(err) {
        fs.unlink(path);
        if (callback) callback(err.message);
      });
    // If file already exists
    } else {
      callback();
    }
  });
};

var readAlbums = function(req, res) {
  fs.readFile('dataFile.json', 'utf8', function readFileCallback(err, data){
    if (err){
      if(err.code === 'ENOENT'){
        fs.writeFile('dataFile.json', '', 'utf8', function(){}); 
        res.json();
      } 
      return err;
    } else {
      var obj = null;
      if(data){
        obj = JSON.parse(data);
      }
      res.json(obj);
    }
  });
};

var writeAlbums = function(req, res) {
  var value = req.body;
  fs.readFile('dataFile.json', 'utf8', function readFileCallback(err, data){
    if (err){
      return err;
    } else {
      var obj = [];
      if(data){
        obj = JSON.parse(data);
      }
      obj.push(value);
      var json = JSON.stringify(obj); 
      fs.writeFile('dataFile.json', json, 'utf8', function(error, data){
        res.json(obj);
      }); 
    }
  });
};

module.exports = exports = {
  "index" :                index,
  "download" :             download,
  "downloadAll" :          downloadAll,
  "readAlbums" :           readAlbums,
  "writeAlbums" :          writeAlbums
};