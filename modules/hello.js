var _ = {};
module.exports = {
	helptext: "hello - Says hello. Test module", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		_.output.log("", "Initialised hello module")
	},
	exec: function(ircdata) {
		_.irc.privmsg("#powder-bots", "Hello! :D");
	}
}