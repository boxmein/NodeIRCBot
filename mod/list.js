var _ = null, tempstr = null; 

module.exports = {
  disables: [],
  fname: 'list',
  help: 'Lists all the commands (Modules are capitalized)',
  params: ["[module]"],  

  tempstr: null, // keep a copy of the string (if config.js specifies)
  onInit: function(under) {
    _ = under;
  },
  onRun: function(ircdata) {

    // handles the optional module argument
    if (ircdata.message.words[1] && _.commands.cmds.hasProperty(ircdata.message.words[1]) && 
      _.commands.cmds[ircdata.message.words[1]].isModule)
      return ircdata.words[1] + ": " + 
          _.commands.cmds[ircdata.message.words[1]].subcmds.join(', '); // Module: command, command, command

    if (_.config.list.dontEmphasizeModules) 
      return Object.keys(_.commands.cmds).join(', ');           // command, command, module, command, module

    if (_.config.list.cacheCommandString)
      return tempstr || (tempstr = _.commands.getCommands().join(', ')); // generated on first run, then kept indefinitely

    return _.commands.getCommands().join(', ');                 // command, command, Module, command, Module
  },
};

