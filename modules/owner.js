var _ = {};
module.exports = {
	helptext: "owner <subcommand> [arguments...] - owner-only commands (danger danger!)", 
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
		}
		//
		// #owner load <module> - loads a module. re-loads
		//
		else if (subcmd == "load") 
		{
			var script = ircdata.args.shift() || false;
			var scriptfile = "";
			if (!script)
				throw "No script argument passed: " + script;
			// indexof ! === 0 means that you take the path literally
			// ^ false means don't take it literally and append command values
			if (script.indexOf("!") !== 0)
				scriptfile = "./modules/" + script + ".js";
			else
				scriptfile = script;
			// If error then caught in irc-bot.js
			_.commands.load(script, scriptfile);
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
		else if (subcmd == "relist")
		{
			_.commands.cmds.list.setList(_.commands.generateCmdList());
		}
	}
}