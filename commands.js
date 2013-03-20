var _ = {}; // Contains all the references to our objects
var commands = {
	prefix: "#",
	cmds: {},
	helps: {},
	// Gives me module references to use
	init: function(underscore) {
		_ = underscore;
		try { 
			this.load("hello", "./modules/hello.js");
		}
		catch (err) {
			_.output.err("commands.init", "Couldn't load commands: " + err);
		}
	},
	exec: function(ircdata) {
		if (!this.cmds.hasOwnProperty(ircdata.command)) 
			throw "Command not found: " + ircdata.command;
		else if (!this.cmds[ircdata.command].enable)
			throw "Command is disabled: " + ircdata.command;
		else {
			this.cmds[ircdata.command].exec(ircdata);
		}
	},
	load: function(cmd, file) {

		if (!/^\.\//.test(file))
			throw "File name invalid: "+ file;
		try {
			this.cmds[cmd] = require(file);
			if(this.cmds[cmd].init(_))
				throw "Init failed for command " + cmd;
			this.helps[cmd] = this.cmds[cmd].getHelp();
		}
		catch (err) {
			throw "Error loading file: " + err;
		}
	}
}
module.exports = commands;