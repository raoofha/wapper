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
* ```wapper``` put all unnecessary stuff in ```.stuff``` in the current directory


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
