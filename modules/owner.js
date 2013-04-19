var _ = {};
module.exports = {
	helptext: {
		base: "owner <subcommand> [arguments...] - owner-only commands (danger danger!)", 
		cmds: {
			"enable": "enable <module> - sets a module's .enable flag to 1", 
			"disable": "disable <module> - sets a module's .enable flag to 0",
			"load"  : "load <filename> <commandname> - loads a module (ex: load ./modules/info.js info)",
			"reload": "reload <module> - reloads an already loaded module (ex: reload info)",
			"config": "config <variable> <value> - sets a value for a var in config.js", 
			"relist": "relist - reloads the command list",
			"quit"  : "quit - quits the bot",
			"restart": "restart - restarts the bot via a child process",
			"list" : "list - lists all my commands"
		}
	},
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		console.log("Initialised owner.js");

	},
	exec: function(ircdata) {
		if (!_.commands.sender_isowner(ircdata.hostmask)) 
			throw "Sender not owner";
		var subcmd = ircdata.args.shift() || false;
		if (!subcmd) 
			throw "No subcommand specified";
		//
		// #owner enable <module> - sets its .enable flag to 1
		//
		if (subcmd == "enable") 
		{
			var command = ircdata.args.shift() || false;
			if (!command) 
				throw "No command to enable: " + command;
			if (!_.commands.cmds.hasOwnProperty(command))
				throw "No such command: " + command;
			_.commands.cmds[command].enable = 1;
			if (_.commands.cmds[command].onEnable)
				_.commands.cmds[command].onEnable();
		}
		//
		// #owner disable <module> - sets its .enable flag to 0
		//
		else if (subcmd == "disable") 
		{
			var command = ircdata.args.shift() || false;
			if (!command) 
				throw "No command to disable: " + command;
			if (!_.commands.cmds.hasOwnProperty(command))
				throw "No such command: " + command;
			_.commands.cmds[command].enable = 0;
			if (_.commands.cmds[command].onDisable)
				_.commands.cmds[command].onDisable();
		}
		//
		// #owner load <filename> <script> - loads a module.
		//
		else if (subcmd == "load") 
		{
			var filename = ircdata.args.shift() || false;
			if (!filename)
				throw "No filename argument passed: " + filename;
			var commandname = ircdata.args.shift() || false;
			if (!commandname)
				throw "No command name specified: " + commandname;
			_.commands.load(commandname, filename);
		}
		//
		// #owner reload <module> - reloads existing module
		else if (subcmd == "reload")
		{
			var module = ircdata.args.shift() || false;
			if (!module)
				throw "No module argument passed: " + module;
			if (!_.commands.cmds.hasOwnProperty(module))
				throw "No such command: " + module;
			_.output.log("owner:reload", "Reloading module: " + module);
			_.commands.reload(module);
		}
		//
		// #owner config <key> [value] - returns <key>'s value or sets <key> to [value]
		//
		else if (subcmd == "config")
		{
			var configrule = ircdata.args.shift() || false;
			if (!configrule) 
				throw "No config rule passed: " + configrule;
			if (!_.config.hasOwnProperty(configrule)) 
				throw "No such configuration variable: " + configrule;
			var configvalue = ircdata.args.shift() || false;
			if (!configvalue) 
			{
				_.commands.respond(ircdata, _.config[configrule]);
			}
			try { configvalue = parseInt(configvalue); }
			catch (err) {}
			_.config[configrule] = configvalue;
		}
		//
		// #owner relist - regenerates the command list
		//
		else if (subcmd == "relist")
		{
			_.commands.cmds.list.setList(_.commands.generateCmdList());
		}
		//
		// #owner quit - makes the bot quit :(  
		//
		else if (subcmd == "quit") {
			var index = Math.floor(Math.random() * quitmessages.length);
			_.irc.quit(quitmessages[index]);
		}
		//
		// #owner restart - makes the bot restart
		//
		else if (subcmd == "restart") {
			_.output.announce("Restarting: Passing on control to restart.bat");
			var child = _.cp.spawn("node", "irc-bot.js", {detached: true, stdio: ['ignore', null, null]});
			child.unref();
			this.exec({hostmask: "unaffiliated/boxmein", args: ["quit"]});
		}
		//
		// #owner list - lists owner commands
		//
		else if (subcmd == "list") {
			_.commands.respond(ircdata, "list, quit, relist, config, enable, disable, load, reload, restart");
		}
		// 
		// #owner recmd - reloads every command. 
		// 
		else if (subcmd == "recmd") {
			_.commands.respond(ircdata, _.commands.init(_) ? "Something went wrong, see log" : "Commands reloaded");
		}
	}
}

var quitmessages = [
    "Get mad!",
    "Don't make lemonade!",
    //"Prometheus was punished by the gods for giving the gift of knowledge to man. He was cast into the bowels of the Earth and pecked by birds.",
    //"It won't be enough.",
    //"The answer is beneath us.",
    //"Her name is Caroline. Remember that.",
    //"That's all I can say.",
    //"I don't understand! I did everything you asked!",
    //"Why...?",
    //"Critical error.",
    "Shutting down.",
    //"I don't blame you.",
    //"I don't hate you.",
    //"No hard feelings.",
    "Goodbye.",
    "Hibernating.",
    "Resting.",
    "Nap time."
    //"Unknown error.",
    //"Malfunctioning.",
    //"It burns.",
    //"Take me with you.",
    //"That was nobody's fault.",
    //"I blame myself.",
    //"I probably deserved it."
];