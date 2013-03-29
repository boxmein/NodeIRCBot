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
		var eaten = _.commands.cleanup_query(ircdata.args[0] || ircdata.sender);
		if (eaten.length > 20) 
			eaten = eaten.slice(0, 20);
		_.irc.action(ircdata.channel, "eats " + eaten);
	}
}