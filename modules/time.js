var _ = {};
module.exports = {
	helptext: "time - loltime", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		console.log("Initialised time.js");
	},
	exec: function(ircdata) {
		var d = new Date(Date.now());
		var currtimestr = d.getHours() + ":" + d.getMinutes();
		if (d.getHours() < 11)
			_.commands.respond(ircdata, "It looks like sleep o' clock to me (" + currtimestr + ")");
		else if(d.getHours() + "" + d.getMinutes() == "1111") 
			_.commands.respond(ircdata, "You better be bloody wishing it's 11:11");
		else
		 _.commands.respond(ircdata, currtimestr);
	}
}