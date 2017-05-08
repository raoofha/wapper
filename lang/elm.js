const execSync = require('child_process').execSync;
const fs = require("fs");

const od = global.opts.output;
const o = `${od}/out.js`;
if (!fs.existsSync(od)){fs.mkdirSync(od);}
module.exports = (source,i)=> {
  if(!i){
    i = `${od}/in.elm`
    fs.writeFileSync(i,source);
  }
  execSync(`elm-make --yes ${i} --output ${o}`)
  return fs.readFileSync(o,"utf8");
}
