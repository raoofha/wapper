const tempy = require("tempy");
const execSync = require('child_process').execSync;
const fs = require("fs");

module.exports = (source,i)=> {
  if(!i){
    i = tempy.file({extension:"elm"})
    fs.writeFileSync(i,source);
  }
  let o = tempy.file({extension:"js"})
  execSync(`elm-make --yes ${i} --output ${o}`)
  return fs.readFileSync(o,"utf8");
}
