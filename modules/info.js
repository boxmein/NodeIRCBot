// _ is the general object to access references made in irc-bot.js (one reference per module!)
var _ = {};
module.exports = {
	// gets used when #help <cmd> is done
	helptext: "info - displays general info about the bot", 
	// #owner disable/enable uses this
	enable: 1,
	// getHelp is run when generating the help texts object, right after loading it
	getHelp: function() { return this.helptext; },
	// Init runs when initializing the script, aka right after loading it
	// Return anything but false when something went wrong
	init: function(underscore) { 
		// References get passed here, better set _ to what we need from it
		_ = underscore; 
		// General info message, useful for debug
		console.log("Initialised info.js");
	},
	// Each time the command is run.
	exec: function(ircdata) {
		_.commands.respond(ircdata, "I'm boxmein's IRC bot, written in Javascript, powered by Node.js and my source code is visible at https://github.com/boxmein/NodeIRCBot :)", true);
	}
}