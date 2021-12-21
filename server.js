// File: server.js
// Purpose: development server to use with express
//

const express = require('express');
const bodyParser = require('body-parser');


var https = require("https");
var http = require("http");
var app = express();
var curl = require("./curl");

//
// All of this is pre-amble for express
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname, {
    "setHeaders": function (res, path, stat) {
        
        // Create a map of extensions and
        // what headers they should get.
        // 
        // If no mapping is found...don't do anything
        var headerMap = {
            "js": {
                "encoding": "gzip",
                "content": "application/javascript"
            },
            "map": {
                "encoding": "gzip",
                "content": "application/octet-stream"
            },
            "css": {
                "encoding": "gzip",
                "content": "text/css"
            },
            "html": {
                "encoding": "gzip",
                "content": "text/html"
            },
            "txt": {
                "encoding": "gzip",
                "content": "text/text"
            },
            "xml": {
                "encoding": "gzip",
                "content": "text/xml"
            },
            "ttf": {
                "encoding": "gzip",
                "content": "application/octet-stream"
            },
            "jpg":{
                "encoding": "gzip",
                "content": "image/jpeg"
            },
            "png":{
                "encoding": "gzip",
                "content": "image/png"
            },
            "pdf": {
                "encoding": "gzip",
                "content": "application/pdf"
            }
        }

        var suffix = path.match(/[A-Za-z0-9]+$/)[0];

        if (headerMap[suffix]) {
            res.header("Content-Encoding", headerMap[suffix].encoding);
            res.header("Content-Type", headerMap[suffix].content);
        }

    }
}));



app.use(function(req,res,next){
    console.log("PING!");
    console.log(req.query, req.url);
    next();
})

app.get("/api/makeCredential", (req, res) => {

	let test =  curl.makeCredential("LARRY")
		.then((data) => {
			res.status(200).send(data);
		})
		.catch((err) => {
			res.status(500).send("WELP...SHIT!");
		})
		
	console.log("TEST",test);

});


// //////////////////////////////////////
//
// CORE OF APPLICATION:
//
// Need 3 routes to:
//
// 1.) *** SECRET CREATION ***
//    a.) Create Secret
//    b.) Accept Payment of $1
//
// 2.) Look up price of secret based on user's lookup-key
//
// 3.) *** RETURN SECRET AND KEY ***
//    a.) Look up price of secret
//    b.) Charge Card
//
// //////////////////////////////////////




/*
app.listen(
  port,
  () => console.log(`listening on - http://localhost:${port} - ${new Date()}`)
);
*/
var fs = require("fs");
let sslOptions = {
   key: fs.readFileSync('localhost.key'),
   cert: fs.readFileSync('localhost.crt')
};
http.createServer(app).listen(80)
https.createServer(sslOptions,app).listen(443)