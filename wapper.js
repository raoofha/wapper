#! /usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
var express = require("express");
var { JSDOM } = require("jsdom");
var fs = require("fs");
var path = require("path");
var lang = require("./lang");
var chokidar = require('chokidar');
const chalk = require('chalk');
const tinylr = require("tiny-lr");
const bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var wd = process.cwd();
var indexParentLoc;
var indexFileLoc;
var cached = {}
var opts = {
  port : argv.port || 3000,
}

if(argv.i){
  if(argv.i.endsWith("html")){
    indexParentLoc = path.join(wd, argv.i.substring(0,argv.i.lastIndexOf("/")));
    indexFileLoc = path.join(wd, argv.i);
  }else{
    indexParentLoc = path.join(wd, argv.i);
    indexFileLoc = path.join(wd, argv.i, "index.html");
  }
}else{
  indexParentLoc = wd;
  indexFileLoc = wd+"/index.html";
  if (!fs.existsSync(indexFileLoc)){
    console.error(chalk.red("index.html not found"));
    process.exit();
  }
}
let stuffLoc = indexParentLoc + "/.stuff";
if (!fs.existsSync(stuffLoc)){
  fs.mkdirSync(stuffLoc);
}
process.chdir(stuffLoc);

var watcher = chokidar.watch(indexParentLoc,{ ignored: /(^|[\/\\])\./ })
var lastmtime = null;
watcher.on("ready", ()=> {
  watcher
    .on("add", p => {
      console.log("add", p);
      onChange(p);
    })
    .on("change", (p,stat)=> {
      if(lastmtime !== stat.mtime.toString()){
        console.log("change", p);
        //console.log(lastmtime,stat.mtime.toString());
        onChange(p);
        lastmtime = null;
      }
      lastmtime = stat.mtime.toString();
    })
});

var onChange = (p)=> {
  if(p === indexFileLoc){
    cached[null] = false 
  }
  cached[p] = false;
  cached[indexFileLoc] = false;
  buildClient();
  //tinylr.changed(()=>console.log("reload"));
  tinylr.changed(p);
}

var compile = (type, loc, source)=>{
  if(cached[loc]){
    return cached[loc];
  }else if(lang[type]){
    let c = lang[type](source);
    cached[loc] = c;
    return c;
  }else{
    cached[loc] = source;
    return source;
  }
}

const buildClient = (dev = true)=>{
  let d;
  if(!cached[indexFileLoc]){
    console.log("building index...");
    if(fs.existsSync(indexFileLoc)){
      let dom = new JSDOM(fs.readFileSync(indexFileLoc,"utf8"))
      //dom.serialize();
      d = dom.window.document;
    }else{
      return console.error("Main html file not found");
    }
    d.querySelectorAll("script").forEach((s)=>{
      let source = "";
      let type = s.type || path.extname(s.src).substring(1);
      if(type){
        if(s.src){
          let p = wd+"/"+s.src;
          if(fs.existsSync(p)){
            source = fs.readFileSync(p,"utf8");
            s.textContent = compile(type,path.join(wd, s.src),source);
          }else{
            console.error("File does not exist:", s.src);
          }
        }else{
          s.textContent = compile(type,null,s.textContent);
        }
        s.removeAttribute("src");
        s.removeAttribute("type");
      }
    });
    if(dev){
      let lr = d.createElement("script");
      lr.src = `http://localhost:${ opts.port }/livereload.js`;
      d.body.appendChild(lr);
    }
    cached[indexFileLoc] = d.documentElement.outerHTML;
  }
  return cached[indexFileLoc];
};

app.get("/", (req, res, next)=>{
  res.send(buildClient());
});

app.use(tinylr.middleware({ app }))
app.use(express.static(wd));
app.listen(argv.port || opts.port , ()=>{
  console.log(chalk.green(`open http://localhost:${ opts.port }`));
});
