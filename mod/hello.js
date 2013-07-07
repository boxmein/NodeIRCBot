/*
 *    {
 *      fname: "command",           // Command's name. 'function name'
 *      help: "Command help",       // Command's short helptext
 *      onRun: function,            // Ran when the command is called.
 *      onEnable: function,         // Ran when the command is enabled. 
 *      onDisable: function,        // Ran when the command is disabled.
 *      params: [],                 // Command's arguments in an array. Will be converted to a String.
 *      onQuit: function            // Ran when the program quits. 
 *      onInit: function (_)        // Ran when the program starts. _ contains references. 
 *    }
 */

var _ = null;

module.exports = {
  // List of channels the command is disabled in.
  disables: [],
  // Command name. Required.
  fname: "hello",
  // Command help text. Also required. :) 
  help: "Hello World equivalent",
  // Command parameters, for when the command needs arguments.
  // Might also be generated automatically when left undefined.
  params: [],  
  // Run when the command is initialized.
  // Equivalent of the old init
  onInit: function(under) {
    _ = under;
  },
  // Run when the command is executed.
  // Return a non-null value to respond to the sender with.
  // Same as exec in the old format.
  onRun: function() {
    return _.config.commands.hello.message || "Hi"; 
  },
  // Equivalents as the old format.
  // Ran when the command is enabled or disabled.
  onEnable: function (channel) {},
  onDisable: function (channel) {}
};