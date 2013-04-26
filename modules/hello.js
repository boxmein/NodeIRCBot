// HTTP 418 I'm a teapot
// And I'm useful as a template

/*jshint node: true*/
var _ = {};
module.exports = {
	helptext: "hello - Says hello. Test module", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	
	init: function(underscore) { // During bot setup
		_ = underscore; 
		console.log("Initialised hello.js");
		// Return anything but false when something went wrong
		// (false means anything falsifiable such as empty string or undefined)
	},
	exec: function(ircdata) { // After someone calls the command
		_.commands.respond(ircdata, "Hello! :D", true);
	},
	die: function() { // Before closing the bot
		_.output.alert("hello:die", "D:");
	},
	onEnable: function() { // After enabling the command
		_.output.log("hello:onEnable", ":)");
	},
	onDisable: function() { // After disabling the command
		_.output.log("hello:onDisable", ":(");
	}
};