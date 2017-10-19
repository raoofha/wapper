const execSync = require('child_process').execSync;
const fs = require("fs");
const path = require("path")
const mkdirp = require("mkdirp")

const od = ".stuff/cljs";
const o = `${od}/out.js`;
let odi = ".stuff/cljs/index/main";
mkdirp.sync(odi);
module.exports = (source,i)=> {
  let main = "main.core";
  let src = "src";
  if(!i){
    fs.writeFileSync(odi+"/core.cljs",source);
    src = odi+"/core.cljs"
  }else{
    let ri = path.relative(process.cwd(),i)
    main = ri.substring(4,ri.lastIndexOf(".")).replace(/\//g, ".").replace(/_/g,"-")
  }
  //execSync(`echo "(require '[lumo.build.api :as b]) (b/build [\\"src\\" \\".stuff/cljs/index\\"] {:main '${main} :output-to \\"${o}\\" :output-dir \\"${od}/out\\" :source-map false})" | lumo -`)
  execSync(`echo "(require '[lumo.build.api :as b]) (b/build \\"${src}\\" {:main '${main} :output-to \\"${o}\\" :output-dir \\"${od}/out\\" :source-map false})" | lumo -`)
  return fs.readFileSync(o,"utf8");
}
