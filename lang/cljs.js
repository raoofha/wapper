const execSync = require('child_process').execSync;
const fs = require("fs");

const od = "cljs-stuff";
const o = `${od}/out.js`;
const odi = od+"/index";
if (!fs.existsSync(od)){fs.mkdirSync(od);}
if (!fs.existsSync(odi)){fs.mkdirSync(odi);}
module.exports = (source,i)=> {
  if(!i){
    i = `${od}/index/main.cljs`
    fs.writeFileSync(i,source);
  }
  execSync(`echo "(require '[lumo.build.api :as b]) (b/build \\"${odi}\\" {:main 'main :output-to \\"${o}\\" :output-dir \\"${od}/out\\" :source-map false})" | lumo -c ${odi} -`)
  //execSync(`cd .stuff; echo "(require '[lumo.build.api :as b]) (b/build \\"cljs/index\\" {:main 'main :output-to \\"cljs/out.js\\" :output-dir \\"cljs/out\\" :source-map false})" | lumo -c cljs/index - ; cd ..`)
  return fs.readFileSync(o,"utf8");
}
