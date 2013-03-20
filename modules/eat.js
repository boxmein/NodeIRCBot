var _ = {};
module.exports = {
	helptext: "eat | eat <user> - eats someone", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		console.log("Initialised eat.js")
	},
	exec: function(ircdata) {
		var eaten = ircdata.args[0] || ircdata.sender;
		_.irc.action(ircdata.channel, "eats " + eaten);
	}
}