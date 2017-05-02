# wapper : develop without clutter

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
* ```wapper``` put all unnecessary stuff in ```.stuff``` in the current directory
* open multiple ```wapper``` by providing different ```--port``` option


### Supported file types:
* elm

file an issue for your favorite language


### Examples

```html
<html>
  <head>
  </head>
  <body>
    <script type="elm">
import Html exposing (text)

main =
  text "test yeh"
    </script>
    <script>
var app = Elm.Main.fullscreen();
    </script>
  </body>
</html>
```

```html
<html>
  <head>
  </head>
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
elm      run elm commands within .stuff directory
```
