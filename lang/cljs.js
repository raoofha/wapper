const execSync = require('child_process').execSync;
const fs = require("fs");
const path = require("path")

const od = "cljs-stuff";
const o = `${od}/out.js`;
let odi = od+"/index";
if (!fs.existsSync(od)){fs.mkdirSync(od);}
if (!fs.existsSync(odi)){fs.mkdirSync(odi);}
module.exports = (source,i)=> {
  let main = "main";
  if(!i){
    i = `${od}/index/main.cljs`
    fs.writeFileSync(i,source);
  }else{
    //odi = "."
    let ri = path.relative(process.cwd(),i)
    main = ri.substring(0,ri.lastIndexOf(".")).replace(/\//g, ".").replace(/_/g,"-")
  }
  //execSync(`echo "(require '[lumo.build.api :as b]) (b/build \\"${odi}\\" {:main 'main :output-to \\"${o}\\" :output-dir \\"${od}/out\\" :source-map false})" | lumo -c ${odi} -`)
  execSync(`echo "(require '[lumo.build.api :as b]) (b/build \\".\\" {:main '${main} :output-to \\"${o}\\" :output-dir \\"${od}/out\\" :source-map false})" | lumo -`)
  //execSync(`cd .stuff; echo "(require '[lumo.build.api :as b]) (b/build \\"cljs/index\\" {:main 'main :output-to \\"cljs/out.js\\" :output-dir \\"cljs/out\\" :source-map false})" | lumo -c cljs/index - ; cd ..`)
  return fs.readFileSync(o,"utf8");
}
