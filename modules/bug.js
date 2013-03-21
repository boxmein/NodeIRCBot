var _ = {};
module.exports = {
	helptext: "bug <body> - Reports bugs", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		console.log("Initialised bug.js");
	},
	exec: function(ircdata) {
		_.commands.respond(ircdata, "Bug?! Where?", true);
		_.irc.action(ircdata.channel, "finds the bug spray");
	}
}