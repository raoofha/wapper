# wapper : develop with no/less config

```
npm i -g wapper
mkdir myproject
cd myproject
vim index.html
wapper
```
open localhost:3000

### Features
* start coding without any config
* live reload
* show compile errors inside browser
* open multiple ```wapper``` by providing different ```--port``` option


### Supported filetypes
* elm

file an issue for your favorite language


### Examples

```html
<html>
  <body>
    <script type="elm">
import Html exposing (text)

main =
  text "hello world"
    </script>
    <script>
var app = Elm.Main.fullscreen();
    </script>
  </body>
</html>
```

```html
<html>
  <body>
    <script src="Main.elm"></script>
    <script>
var app = Elm.Main.fullscreen();
    </script>
  </body>
</html>
```

### CLI
```
--input  set input file or directory 
--port   set port
```
