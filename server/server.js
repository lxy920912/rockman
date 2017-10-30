var http = require("http")
var fs = require('fs')
var path = require('path')
var url = require("url")

http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    fs.readFile(path.join(__dirname, "../" + pathname), 'utf-8', function(err, file) {
        if (err) {
            console.log(err);
        }
        console.log(file);
        res.writeHead(200, { "Content-Tyep": "text/html" });
        res.write(file);
        res.end();
    });
}).listen(8888);
console.log("server is listening at port 8888");