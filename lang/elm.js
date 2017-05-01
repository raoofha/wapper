const tempy = require("tempy");
const execSync = require('child_process').execSync;
const fs = require("fs");

module.exports = (source)=> {
  let i = tempy.file({extension:"elm"})
  let o = tempy.file({extension:"js"})
  fs.writeFileSync(i,source);
  execSync(`elm-make --yes ${i} --output ${o}`)
  return fs.readFileSync(o,"utf8");
}
