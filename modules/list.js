/*jshint node: true*/

var _ = {};
module.exports = {
	helptext: "list - lists all commands I have loaded (... commands have sub-commands as well)", 
	enable: 1,
	commandList: "",
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		console.log("Initialised list.js");
	},
	exec: function(ircdata) {
		_.commands.respond(ircdata, this.commandList);
	},
	setList: function(arrr) {
		this.commandList = arrr;
		console.log("Command list: " + this.commandList);
	}
};