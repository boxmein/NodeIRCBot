var _ = null;

module.exports = {
  disables: [],
  fname: "help",
  help: "Literally this.",
  params: ["<command>", "[subcmd]"],  
  onInit: function(under) {
    _ = under;
  },
  onRun: function(ircdata) {
    // okay so let us begin
    if (ircdata.message.words.length < 2) 
      return "help <command>"; 

    _.output.log(0, "help text for? " + ircdata.message.words[1]);
    if (_.commands.cmds.hasOwnProperty(ircdata.message.words[1])) {
      _.output.log(0, "Getting help text for " + ircdata.message.words[1]);
      // << #help help
      // >> boxmein: <command> [subcmd] -> get help text on command name
      return "{0} {1} -> {2}".format(
        ircdata.message.words[1],
        _.commands.cmds[
          ircdata.message.words[1]
          ].params,
        _.commands.cmds[
          ircdata.message.words[1]
          ].help);
    } 
  },
};