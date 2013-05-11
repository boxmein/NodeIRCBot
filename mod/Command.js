/*jshint node: true*/

/** Command.js
  * ====
  * 
  * Defines a constructor for a generic command and an error related to commands. 
  * The constructor fills in some properties and makes sure others are defined.
  * 
**/

/*
 * Command.constructor -> Command
 * Creates a Command object for use later on. Useful for pre-set values to be used.
 * @param command {Object}     An object with the command's properties.
 *    {
 *      fname: "command",           // Command's name. 'function name'  Required.
 *      help: "Command help",       // Command's short helptext. Required.
 *      onRun: function,            // Ran when the command is called. Required.
 *      onEnable: function,         // Ran when the command is enabled. 
 *      onDisable: function,        // Ran when the command is disabled.
 *      params: [],                 // Command's arguments in an array. Will be converted.
 *      onQuit: function,           // Ran when the program quits. 
 *      onInit: function            // Ran when the program starts. 
 *    }
*/
var Command = function (command) {
  if (!("fname" in command && "onRun" in command && "help" in command)) {
    throw new CommandError("Command's name, execution function or help text left undefined!",
      'Command.constructor'); 
  }
  this.fname = command.fname;
  this.help = command.help;
  this.onRun = command.onRun;

  this.onEnable = command.onEnable ||
    function() {
      return "Enabled command: " + this.fname; 
    };

  this.onDisable = command.onDisable ||
    function() {
      return "Disabled command: " + this.fname; 
    };

  // resorts to function's parameters.
  // onRun's first parameter is always ircdata, skip that.
  this.params = formatParams(command.params || this.onRun.params().slice(1)); 

  this.onQuit = command.onQuit || null;
  this.onInit = command.onInit || null;
};


var CommandError = Error; 
CommandError.prototype.typeOf = function() { return "CommandError"; };
CommandError.prototype.fname = null; 
CommandError.prototype.constructor = function (text, name) {
  this.fname = name; 
  return new Error("CommandError: " + text); 
};

// Returns a formatted string given an array of command parameters.
var formatParams = function (params) {
  params = params.join(", ");
  params = params.substring(0, params.length-2); 
  return "(" + params + ")"; 
};

module.exports = {
  'Command': Command, 
  'CommandError': CommandError
};

Function.prototype.params = function() {
  var fstr = this.toString();
  return fstr.slice(fstr.indexOf('(')+1, fstr.indexOf(')')).match(/([^\s,]+)/g);
};

