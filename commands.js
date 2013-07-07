var Cmd = require('./mod/Command.js');
module.exports.cmds = {};
var _ = null;

var new_commands = [
  "./mod/hello.js",
  "./mod/eat.js",
  "./mod/time.js",
  "./mod/help.js",
  "./mod/list.js",
  "./mod/sendtoxsbot.js"
  // Add more here,
  // Don't forget the commas and
  // No trailing comma!
  // [a, b, c,] BAD
  // [a b c] BAD
  // [a, b, c] GOOD
];



// called from entry point --> returned object will become _.helps.
module.exports.initAll = function(un) {
  _ = un;
  _.output.log(0, "Starting module loading..."); 
  new_commands.map(
    function(each) { 
      try {
        loadNew(each);
      } catch (err) {
        _.output.log(20, each + " failed to load! \n" + err + "\n" + err.stack); 
      }
    }
  );
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
  cmd_old.fname = String(name); 
  _.commands.respond = _.respondToSender;

  var cmd = new Cmd.Command(cmd_old); 
  module.exports.cmds[cmd.fname] = cmd; 
  cmd.onInit(_); 
};

// this is for the sake of showing off Module vs command
module.exports.getCommands = function () {
  var temp = []; 
  for (var k in module.exports.cmds) 
  {
    if (module.exports.cmds[k].isModule)
      temp.push(k.toProperCase()); // defined below
    else temp.push(k);
  }
  return temp;
}

String.prototype.toProperCase = String.prototype.toProperCase || function () {
    return this.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};