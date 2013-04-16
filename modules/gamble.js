/*jshint node: true*/
var _ = {};
module.exports = {
	helptext: {
		base: "gam <subcommand> [arguments] - gamble :D", 
		cmds: {
			"coin": "coin - flips a coin (50/50)", 
			"dice": "dice <count>d<sides> - throws dice (ex. dice 2d6)", 
			"roul": "roul - Russian roulette"
		}
	}, 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		console.log("Initialised hello.js");
	},
	exec: function(ircdata) {
		_.commands.respond(ircdata, "Hello! :D", true);
	}
};