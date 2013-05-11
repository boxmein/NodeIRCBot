/*
 *    {
 *      fname: "command",           // Command's name. 'function name'
 *      help: "Command help",       // Command's short helptext
 *      onRun: function,            // Ran when the command is called.
 *      onEnable: function,         // Ran when the command is enabled. 
 *      onDisable: function,        // Ran when the command is disabled.
 *      params: [],                 // Command's arguments in an array. Will be converted.
 *      onQuit: function            // Ran when the program quits. 
 *      onInit: function (_)        // Ran when the program starts. _ contains references. 
 *    }
 */

var _ = null;

module.exports = {
  fname: "hello",
  help: "Hello World equivalent",
  params: [], // Params contains a list of 'argument names' to be passed. 
  onInit: function(under) {
    _ = under;
  },
  onRun: function() {
    return _.config.commands.hello.message || "Hi"; 
  }
};