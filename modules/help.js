var _ = {};
module.exports = {
	helps: {}, // # so meta
	helptext: "help <command> - returns command usage etc", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		console.log("Initialised help.js");
	},
	exec: function(ircdata) {
		ircdata.args[0] = _.commands.cleanup_query(ircdata.args[0]);
		if (!ircdata.args[0]) {
			// Run myself with "help" when nothing was used
			ircdata.args[0] = "help";
			return this.exec(ircdata);
		}
		else if(this.helps.hasOwnProperty(ircdata.args[0])) {
			_.commands.respond(ircdata, this.helps[ircdata.args[0]]);
		}
		else throw "No help found for " + ircdata.args[0];
		
	},
	setHelp: function(helps) {
		this.helps = helps;
	}
}