// HTTP 418 I'm a teapot
// And I'm useful as a template

var _ = {};
module.exports = {
	helptext: "hello - Says hello. Test module", 
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
}