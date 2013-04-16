/*jshint node: true*/

var _ = {};
module.exports = {
	helps: {}, // # so meta
	helptext: "help <command> - returns command usage etc", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		console.log("Initialised help.js");
	},
	exec: function(ircdata) {
		var subcmds;
		if (ircdata.args[0])
			subcmds = ircdata.args[0].split('.');
		subcmds.map(_.commands.cleanup_query);
		if (!ircdata.args[0]) {
			// Run myself with "help" when nothing was used
			ircdata.args[0] = "help";
			return this.exec(ircdata);
		}
		else if(this.helps.hasOwnProperty(ircdata.args[0])) {
			if (ircdata.args[0] == "owner" || ircdata.args[0] == "admin" || ircdata.args[0] == "gam")
				_.commands.respond(ircdata, this.helps[ircdata.args[0]].base);
			_.commands.respond(ircdata, this.helps[ircdata.args[0]]);
		}
		// Strange support for sub-commanded helps.
		// 1. getHelp() must return an object where base is the helptext
		// 2. and the object must also have a cmds[] array where every 
		//    subcommand is its own key/value pair
		else if(ircdata.args[0].indexOf('.') != -1) {
			
			if (this.helps[subcmds[0]].cmds.hasOwnProperty(subcmds[1])) {
				_.commands.respond(ircdata,this.helps[subcmds[0]].cmds[subcmds[1]]);
			}
			else throw "No help found for " + ircdata.args[0];
		}
		else throw "No help found for " + ircdata.args[0];
		
	},
	setHelp: function(helps) {
		this.helps = helps;
	}
};