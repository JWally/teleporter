var zlib = require("zlib");
var fs = require("fs");


module.exports = function(grunt){
    grunt.initConfig({
        "pkg": "package.json",
        "jshint": {
            "prod": {
                "files": ["src/**/*.js"]
            },
            "dev": {
                "files": ["src/**/*.js"]
            }
        },
        "jsbeautifier" : {
            "dev": {
                "src": ["src/**/*.js"]
            },
            "prod": {
                "src": ["src/**/*.js"]
            },
            "options": {
                "js": {
                    "e4x": false,
                    "eval_code": false,
                    "indent_char": " ",
                    "indent_level": 0,
                    "indent_size": 4,
                    "indent_with_tabs": false,
                    "jslint_happy": true,
                    "keep_array_indentation": true,
                    "keep_function_indentation": false,
                    "max_preserve_newlines": 10,
                    "preserve_newlines": true,
                    "space_before_conditional": true,
                    "space_in_paren": false,
                    "unescape_strings": false,
                    "wrap_line_length": 0
                }
            }
        },
        "hogan" : {
            "mytarget": {
                "src": "src/templates/**/*.html",
                "dest": "src/js/dev/dev/brother.js",
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
                    "beautify": false
                },
                "files": {
                    "src/build/output.big.js": [
                        "src/js/dev/lib/**/*.js",
                        "src/js/dev/dev/**/*.js"
                    ]
                }
            },
            "dev": {
                "options": {
                    "sourceMap": true,
                    "beautify": true
                },
                "files": {
                    "src/build/output.big.js": [
                        "src/js/dev/lib/**/*.js",
                        "src/js/dev/dev/**/*.js"
                    ]
                }
            }
        },
        "cssmin": {
          "prod": {
            "files": {
              "./src/css/output.big.css": ["./src/css/dev/*.css"]
            }
          },
          "dev": {
            "files": {
              "./src/css/output.big.css": ["./src/css/dev/*.css"]
            }
          }
        },
        "uncss": {
            "prod": {
                "options": {
                    "ignore": [
                        ".sq-input--focus",
                        ".sq-input--error",
                        ".sq-input---error",
                        ".sq-input---error > input",
                        ".sq-input---error > span"
                    ],
                    "ignoreSheets" : [/fonts.googleapis/]
                },
                "files": {
                    "./src/build/tidy.css": ["./src/index.html"]
                }
            },
            "dev": {
                "options": {
                    "ignore": [
                        ".sq-input--focus",
                        ".sq-input--error",
                        ".sq-input---error",
                        ".sq-input---error > input",
                        ".sq-input---error > span"
                    ]
                },
                "files": {
                    "./src/build/tidy.css": ["./src/index.html"]
                }
            }
        },
        "processhtml": {
            "prod": {
                "files": {
                    "src/build/index.html": ["src/index.html"]
                }
            },
            "dev": {
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
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-uncss");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-processhtml");



    grunt.registerTask("dev", [
        "jsbeautifier:prod",
        "hogan:mytarget",
        "uglify:dev",
        "cssmin:prod",
//        "uncss:prod",
        "processhtml:prod",
        "summer_lean"
    ]);

    grunt.registerTask("prod", [
        "jsbeautifier:prod",
        "hogan:mytarget",
        "uglify:prod",
        "cssmin:prod",
//        "uncss:prod",
        "processhtml:prod",
        "summer_lean"
    ]);

}
