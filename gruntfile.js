var zlib = require("zlib");
var fs = require("fs");


module.exports = function(grunt){
    grunt.initConfig({
        "pkg": "package.json",
        "hogan" : {
            "mytarget": {
                "src": "src/templates/**/*.html",
                "dest": "src/js/brother.js",
                "options": {
                    "binderName": "hulk",
                    "nameFunc": function (fileName) {
                        var s = fileName
                          .replace(/^.*_html\//gi, "")
                          .replace(".html", "")
                          .replace("src/templates/","");

                        return s;
                    }
                }
            }
        },
        "uglify": {
            "prod": {
                "options": {
                    "sourceMap": true,
                    "beautify": true
                },
                "files": {
                    "src/build/output.big.js": [
                        "src/js/lib/**/*.js",
                        "src/js/helpers/**/*.js",
                        "src/js/parts/**/*.js",
                        "src/js/ui/**/*.js",
                        "src/js/brother.js"
                    ]
                }
            }
        },
        "cssmin": {
          "prod": {
            "files": {
              "./src/css/output.big.css": ["./src/css/dev/*.css"]
            }
          }
        },
        "processhtml": {
            "prod": {
                "files": {
                    "src/build/index.html": ["src/index.html"]
                }
            }
        }
    });

    // ///////////////
    // G-ZIP OUR FILES
    // ///////////////
    grunt.task.registerTask("summer_lean", "something",
        function(){
            console.log(".......................................");

            files = fs.readdirSync("src/img");

            var buildMap = [
                ["src/css/output.big.css","dist/tidy.css"],
                ["src/build/output.big.js","dist/output.big.js"],
                ["src/build/index.html","dist/index.html"],
                ["src/build/output.big.js.map","dist/output.big.js.map"],
                ["src/build/robots.txt","dist/robots.txt"],
                ["src/build/sitemap.xml","dist/sitemap.xml"],
                ["src/fonts/marvel.ttf","dist/fonts/marvel.ttf"]
            ];


            files.forEach(function(file){
                buildMap.push(["src/img/" + file,"dist/img/" + file]);
            });

            var done = this.async();
            var i = 0;

            for(i = 0; i < buildMap.length; i++){
                var gzip = zlib.createGzip();
                var r = fs.createReadStream(buildMap[i][0]);
                var w = fs.createWriteStream(buildMap[i][1]);
                console.log(buildMap[i]);
                r.pipe(gzip)
                    .pipe(w)
                    .on("end",function(x){
                        console.log("Done?");
                    });
            }

            setTimeout(function() {
                grunt.log.writeln("All done!");
                grunt.log.writeln(new Date())
                done();
            }, 1000);
        }
    );





    grunt.loadNpmTasks("grunt-hogan");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-processhtml");




    grunt.registerTask("prod", [
        "hogan:mytarget",
        "uglify:prod",
        "cssmin:prod",
        "processhtml:prod",
        "summer_lean"
    ]);

}
