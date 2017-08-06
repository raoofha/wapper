#! /usr/bin/env node
var express = require("express");
var fs = require("fs");
var path = require("path");
var chokidar = require('chokidar');
const chalk = require('chalk');
const tinylr = require("tiny-lr");
const bodyParser = require("body-parser");
const execSync = require('child_process').execSync;
const cheerio = require('cheerio')

var opts = require('minimist')(process.argv.slice(2),{
  default:{
    port : 3000,
    input : "index.html",
    stuff : ".stuff",
  }
});

global.opts = opts;
var lang = require("./lang");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var wd = process.cwd();
var indexParentLoc;
var indexFileLoc;
var cached = {}
var commandString = process.argv.slice(2).join(" ");

if(opts.input){
  if(opts.input.endsWith(".html")){
    indexParentLoc = path.join(wd, path.dirname(opts.input))
    indexFileLoc = path.join(wd, opts.input);
  }else{
    indexParentLoc = path.join(wd, opts.input);
    indexFileLoc = path.join(wd, opts.input, "index.html");
  }
}else{
  indexParentLoc = wd;
  indexFileLoc = path.join(wd,"index.html");
}
if (!fs.existsSync(indexFileLoc)){
  console.error(chalk.red(path.basename(indexFileLoc)+" not found"));
  process.exit();
}

var watcher = chokidar.watch(indexParentLoc,{ ignored: [/(^|[\/\\])\./, /elm-stuff$/, /node_modules$/, /cljs-stuff$/] })
var lastmtime = null;
watcher.on("ready", ()=> {
  //console.log(chalk.green(`open http://localhost:${ opts.port }`));
  console.log(chalk.green("watching "+indexParentLoc));
  watcher
    .on("add", p => {
      console.log(chalk.blue("add "+p));
      changeHandler(p);
    })
    .on("change", (p,stat)=> {
      let cond = lastmtime !== stat.mtime.toString();
      if(cond){
        console.log(chalk.blue("change "+p));
        changeHandler(p);
      }else{
        console.log("change "+p,chalk.red("this shouldn't happen. probably you are using vim."));
      }
      lastmtime = stat.mtime.toString();
    })
});

var changeHandler = (p)=> {
  cached[p] = false;
  cached[indexFileLoc] = false;
  buildClient();
  tinylr.changed(p);
}

var compile = (type, loc, source)=>{
  if(loc && cached[loc]){
    return cached[loc];
  }else if(lang[type]){
    let c = lang[type](source,loc);
    cached[loc] = c;
    return c;
  }else{
    cached[loc] = source;
    return source;
  }
}

const buildClient = (dev = true)=>{
  let $;
  try{
    if(!cached[indexFileLoc]){
      console.log("building ...");
      $ = cheerio.load(fs.readFileSync(indexFileLoc,"utf8"))
      $("script").each((i,$el)=>{
        let el = $($el);
        let s = {
          src: el.attr("src") || "",
          type: el.attr("type"),
          textContent: el.text(),
        }
        let source = "";
        let loc = "";
        let type = s.type || path.extname(s.src).substring(1);
        if(lang[type]){
          if(s.src){
            let p = wd+"/"+s.src;
            if(fs.existsSync(p)){
              source = fs.readFileSync(p,"utf8");
              loc = path.join(wd, s.src);
            }else{
              console.error("File does not exist:", s.src);
            }
          }else{
            source = s.textContent;
            loc = null;
          }
          let compiledText = compile(type,loc,source);
          if(s.type === "cljs"){
            el.text("");
            el.removeAttr("type");
            el.attr("src", "cljs-stuff/out.js")
          }else{
            el.text(compiledText);
            el.removeAttr("src");
            el.removeAttr("type");
          }
        }
      });
      if(dev){
        $("body").append(`<script src="http://localhost:${ opts.port }/livereload.js"></script>`)
      }
      cached[indexFileLoc] = $.html();
      console.log(chalk.green("build finished."));
    }
  }catch(e){
    cached[indexFileLoc] = `<style>body{color:gray;background-color:black;}</style><body><pre>${e.stderr?e.stderr.toString("utf8"): e }</pre><script src="http://localhost:${ opts.port }/livereload.js"></script></body>`
  }
  return cached[indexFileLoc];
};

app.get("/", (req, res, next)=>{
  res.send(buildClient());
});

app.use(tinylr.middleware({ app }))
app.use(express.static(wd));
app.listen( opts.port , ()=>{
  console.log(chalk.green(`serving at http://localhost:${ opts.port }`));
  changeHandler(indexFileLoc);
  //setTimeout(()=>{tinylr.changed(indexFileLoc);}, 1000);
});
