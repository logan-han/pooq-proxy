const config = require("./config.js");
const app = require('express')();
const URL = require('url-parse');
const fs = require('fs');
const http = require('http');
const mkdirp = require('mkdirp');

function download(options, dest, callback) {
    var file = fs.createWriteStream(dest);
    var request = http.get(options, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(callback);
        });
        file.on('error', function (err) {
            fs.unlink(dest);
            if (callback)
                callback(err.message);
        });
    });
}
var CacheCheck = function(req, res, next)
{
  var url = new URL(req.url);
  var filepath = url.pathname.match(/(.*)media_/)[1];
  var filenumber = parseInt(url.pathname.match(/media_(.*).ts/)[1]);
  console.log("Pathname:" + url.pathname);
  console.log("Query:" + url.query);
  console.log("Filepath:" + filepath);
  console.log("Filenumber:" + filenumber);
//  if (!fs.existsSync(config.cachedir + filepath)) {
    mkdirp(config.cachedir + filepath, function (err) {
    if (err) console.error(err)
    else console.log("Create Cache Path:" + config.cachedir + filepath);
    });
//  }

  for(i = filenumber; i < filenumber + config.cachesize; i++) {
    var downloadpath = filepath + "media_" + i + ".ts";
    if (!fs.existsSync(config.cachedir + downloadpath)) {
      console.log("Download:" + downloadpath);
      var src = downloadpath + url.query;
      var dest = config.cachedir + downloadpath;
      var options = {
        host: config.proxyhost,
        port: 80,
        path: src,
        method: 'GET',
        headers: {
          Host: req.hostname
        }
      }
      download(options, dest);
    }
  }
res.sendFile(config.cachedir + url.pathname);
}

app.use('/', CacheCheck);

app.listen(config.port, () => console.log('Listening..'));
