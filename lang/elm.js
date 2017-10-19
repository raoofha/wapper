const execSync = require('child_process').execSync;
const fs = require("fs");
const path = require("path")

const od = global.opts.stuff;
const o = `${od}/out.js`;
if (!fs.existsSync(od)){fs.mkdirSync(od);}
module.exports = (source,i)=> {
  if(!i){
    i = `${od}/in.elm`
    fs.writeFileSync(i,source);
  }else{
    i = path.relative(process.cwd(),i)
  }
  execSync(`cd .stuff; elm-make --yes ../${i} --output ../${o}; cd ..`)
  return fs.readFileSync(o,"utf8");
}
