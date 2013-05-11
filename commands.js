var Cmd = require('./mod/Command.js');
module.exports.cmds = {};
var _ = null;
module.exports.initAll = function(un) {
  _ = un;
  _.output.log(10, "Starting module loading..."); 
  // Add your module files here. 
  // Old modules with loadOld (modules that were for old NodeIRCBot)
  // New modules with loadNew
  loadNew("./mod/hello.js"); 
};


var loadNew = function (filename) {
  _.output.log(1, "Loading new module: " + filename); 
  var cmd = new Cmd.Command(require(filename));
  module.exports.cmds[cmd.fname] = cmd; 
  cmd.onInit(_); 
};

var loadOld = function(filename, name) {
  _.output.log(1, "Loading old module: " + filename); 

  var cmd_old = require(filename); 
  // Conversion
  cmd_old.onRun = cmd_old.exec; 
  cmd_old.help = cmd_old.helptext; 
  cmd_old.onInit = cmd_old.init; 
  cmd_old.onQuit = cmd_old.die; 
  cmd_old.fname = name; 
  
  _.commands = {};
  _.commands.respond = _.respondToSender;

  var cmd = new Cmd.Command(cmd_old); 
  module.exports.cmds[cmd.fname] = cmd; 
  cmd.onInit(_); 
};