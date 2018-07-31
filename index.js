var config = require("./config.js");
var proxy = require('express-http-proxy');
var app = require('express')();
var download = require('download-to-file');
var URL = require('url-parse');

/*
console.log('Downloading to /tmp/example.html')
download('http://example.com/', '/tmp/example.html', function (err, filepath) {
  if (err) throw err
  console.log('Download finished:', filepath)
})

*/
var CacheCheck = function(req, res, next)
{
  var url = new URL(req.url);
  var filepath = url.pathname.match(/(.*)media_/)[1];
  var filenumber = url.pathname.match(/media_(.*).ts/)[1];
  console.log("Pathname:" + url.pathname);
  console.log("Query:" + url.query);
  console.log("Filepath:" + filepath);
  console.log("Filenumber:" + filenumber);
  // call async download here
  /*
  for(var i = filenumber; i < filenumber+20; i++) {
    // check if the file exist first
    var downloadpath = filepath + "media_" + i + ".ts";
    console.log("Downloadpath:" + downloadpath)
    download('http://' + config.proxyhost + downloadpath, downloadpath, function (err, filepath) {
      if (err) throw err
      console.log('Download finished:', filepath)
    })
  */
  // if there's cache file
  //res.send("test");
  // if not
  next();
}

app.use('/', CacheCheck, proxy(config.proxyhost, {
  preserveHostHdr: true
}));

app.listen(3000, () => console.log('listening..'));
