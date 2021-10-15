// File: server.js
// Purpose: development server to use with express
//

/*
  Copyright 2019 Square Inc.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');


const app = express();
const port = 80;



//
// All of this is pre-amble for express
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname, {
    //    "etag": true,
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
        } else {}

    }
}));



app.use(function(req,res,next){
    console.log("PING!");
    console.log(req.query, req.url);
    
    next();
    
})




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





app.listen(
  port,
  () => console.log(`listening on - http://localhost:${port} - ${new Date()}`)
);
