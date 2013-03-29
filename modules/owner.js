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
		// #owner list - lists owner commands
		//
		else if (subcmd == "list") {
			_.commands.respond(ircdata, "list, quit, relist, config <var> <value>, enable <cmd>, disable <cmd>, [load]")
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