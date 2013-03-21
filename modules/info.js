var _ = {};
module.exports = {
	helptext: "info - displays general info about the bot", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		console.log("Initialised info.js");
	},
	exec: function(ircdata) {
		_.commands.respond(ircdata, "I'm boxmein's IRC bot, written in Javascript, powered by Node.js and my source code is visible at https://github.com/boxmein/NodeIRCBot :)", true);
	}
}