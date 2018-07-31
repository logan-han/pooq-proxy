var proxy = require('express-http-proxy');
var app = require('express')();
var download = require('download-to-file');

/* 
console.log('Downloading to /tmp/example.html')
download('http://example.com/', '/tmp/example.html', function (err, filepath) {
  if (err) throw err
  console.log('Download finished:', filepath)
})

app.use('/proxy', proxy('www.google.com', {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // you can update headers
    proxyReqOpts.headers['Content-Type'] = 'text/html';
    // you can change the method
    proxyReqOpts.method = 'GET';
    return proxyReqOpts;
  }
}));
*/
