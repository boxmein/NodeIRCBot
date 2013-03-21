// HTTP 418 I'm a teapot
// And I'm useful as a template
var _ = {};
var sand = {};
module.exports = {
	helptext: "js <javascript> - runs Javascript.", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		sand = new _.Sandbox();
		console.log("Initialised inline-js.js");
	},
	exec: function(ircdata) {
		var js = ircdata.args.join(" ");
		if (_.commands.sender_isowner(ircdata.hostmask)) {
			// Owner gets full access
			var response = "";
			try {
      	response = "R: " + eval("(function() {" + js + "})();");
      }
      catch (err) { throw "PEBKAC: " + err; }
      _.commands.respond(ircdata, response);
		}
		else {
			// Peasants get the sandbox! >:C
			sand.run("(function() {" + js + "})();", function(out) {
      	_.commands.respond(ircdata, "R: " + out.result);
    	});
		}
	}
}