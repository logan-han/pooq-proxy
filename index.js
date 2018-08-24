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

function FindCacheableFileNumber(filepath,filenumber) {
  max_depth = filenumber + config.cachesize;
  for(i = filenumber; i < max_depth; i++) {
    var downloadpath = filepath + "media_" + filenumber + ".ts";
    if (fs.existsSync(config.cachedir + filepath + "media_" + i + ".ts")) filenumber++;
  }
  return filenumber;
}

function CacheCheck(req, res) {
  var url = new URL(req.url);
  var filepath = url.pathname.match(/(.*)media_/)[1];
  var filenumber = parseInt(url.pathname.match(/media_(.*).ts/)[1]);
  var cacheablefilenumber = FindCacheableFileNumber(filepath,filenumber);
  if (!fs.existsSync(config.cachedir + filepath)) {
    if (config.debug == true) console.log(config.cachedir + filepath + "directory created");
    mkdirp.sync(config.cachedir + filepath);
  }
  for(i = cacheablefilenumber; i < cacheablefilenumber + config.cachesize; i++) {
    var downloadpath = filepath + "media_" + i + ".ts";
    if (!fs.existsSync(config.cachedir + downloadpath)) {
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
      download(options, dest,
      function(error, data, response) {
        if (error) console.error(error);
        else if (config.debug == true) console.log("Downloaded:" + downloadpath);
      });
    }
  }
console.log("Serving:" + config.cachedir + url.pathname);
res.sendFile(config.cachedir + url.pathname);
}

app.use('/', CacheCheck);

app.listen(config.port, () => console.log('Pooq Proxy Ready'));
