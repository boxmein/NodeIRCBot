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
			this.load("eat",   "./modules/eat.js");
			this.load("list",  "./modules/list.js");
			this.load("owner", "./modules/owner.js");
			this.load("help",  "./modules/help.js");
			// Load commands before this next line
			this.cmds.list.setList(this.generateCmdList()); // Give cmds the list
			this.cmds.help.setHelp(this.helps);// Give help the object that lists all helpings

		}
		catch (err) {
			_.output.err("commands.init", "Couldn't load all commands: " + err);
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
			throw "Error loading file "+ file + " : " + err;
		}
	},
	generateCmdList: function() {
		arrr = "";
		for (var cmd in this.cmds) {
			arrr += cmd + ", ";
		}
		// remove trailing comma space
		arrr = arrr.substring(0, arrr.length-2);
		return arrr;
	},
	respond: function(ircdata, reply, nonick) {
		_.irc.privmsg(ircdata.channel, (nonick ? "" : ircdata.sender + ": ")  + reply);
	},
	sender_isowner: function(hostmask) {
		return hostmask.search(_.config.owner) != -1;
	}
}
module.exports = commands;