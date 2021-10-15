# AddictionLocker - Front End Code

* Ensure you have npm installed (`npm -v` in your terminal). If not please follow the instructions for your OS: https://www.npmjs.com/get-npm

* Open your terminal and type the following to install the packages:
```
npm install
```

* Then to build the script:
```
grunt dev
```

* Then to run the server in development mode:
```
nodemon server
```

* Then aim your browser at http://localhost:8080/dist

## Components

- Bootstrap v3.3.7 (css framework)
- Hogan.js (ancient javascript templating library)
- GruntJS (JavaScript Task Runner)
-- jsbeautifier (clean up your js)
-- hogan (builds global template library)
-- uglify (makes bundled js smaller)
-- cssmin (minify css)
-- uncss (removes some unused css)
-- processhtml (hardcodes variables that change between dev | prod)
-- summer_lean (custom script to gzip all necessary output files)

## License

```
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
```