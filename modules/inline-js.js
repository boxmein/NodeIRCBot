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
			if (ircdata.args[0] && ircdata.args[0] === "sandbox")
				ircdata.args.shift() && this.runSand(ircdata, js);
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
			this.runSand(ircdata, js);
		}
	},
	runSand: function(ircdata, js) {
		sand.run("(function() {" + js + "})();", function(out) {
			if (out.result.length < 50) 
      	_.commands.respond(ircdata, "R: " + out.result);
      else 
      	_.commands.respond(ircdata, "R:" + out.result.slice(0, 50) + "...");
  	});	
	}
}