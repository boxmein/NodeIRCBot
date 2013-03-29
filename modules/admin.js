var _ = {};
module.exports = {
	admins: {},
	helptext: "admin <subcommand> [arguments] - do admin stuff", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		try {
			this.admins = _.adminData;
		}
		catch (err) { throw "Error loading admin data: " + err; }
		console.log("Initialised admin.js");
	},
	exec: function(ircdata) {
		if (!(this.admins.hasOwnProperty(ircdata.sender)))
			throw "Sender isn't an admin";
		var subcommand = ircdata.args.shift() || false;
		console.log("admin:exec", "sender: " + ircdata.sender + "; sub: " + subcommand);
		if (!subcommand)
			throw "No subcommand specified";
		// MODE #channel +-mode name
		//
		// #admin op <nick> - gives ops to hostmask
		//
		else if (subcommand == "op")
		{
			
			if (this.admins[ircdata.sender].level < 1)
				throw "Sender has too low clearance";
			var subsub = ircdata.args.shift() || false;
			console.log("admin:exec:op", "running op command: subsub:" + subsub);
			if (!subsub) 
				throw "No hostmask specified";
			else 
				_.irc.raw("MODE " + ircdata.channel + " +o " + subsub);
		}
		//
		// #admin deop <nick> - takes ops from hostmask
		// 
		else if (subcommand == "deop")
		{

			if (this.admins[ircdata.sender].level < 1) 
				throw "Sender has too low clearance (<1)";
			var subsub = ircdata.args.shift() || false;
			console.log("admin:exec:deop", "running deop command, subsub:" + subsub);
			if (!subsub) 
				throw "No hostmask specified";
			else 
				_.irc.raw("MODE " + ircdata.channel + " -o " + subsub);
		}
		//
		// #admin cl <nick> [clearance] - sets a clearance on a nick or returns it
		//
		else if (subcommand == "cl") {
			// If clearance is enough
			if (this.admins[ircdata.sender].level < 3) 
				throw "Sender has too low clearance (<3) ";
			// And there's a sub-subcommand (nickname)
			var subsub = ircdata.args.shift() || false;
			if (!subsub) 
				throw "No nick specified";
			// And there's a clearance level
			var subsubsub = ircdata.args.shift() || false;
			// Return clearance if exist
			console.log("admin:exec:cl", "running clearance command, subsub: " + subsub + ", subsubsub:" + subsubsub);
			if (!subsubsub) {
				if (this.admins.hasOwnProperty(subsub) && this.admins[subsub].level) 
					_.commands.respond(ircdata, "Clearance: " + this.admins[subsub].level);
			}
			// Set clearance if nonexist
			else {
				try {
					subsubsub = parseInt(subsubsub);
				} catch(err) { throw "Can't parse clearance: " + err; }
				if (this.admins.hasOwnProperty(subsub))
					this.admins[subsub].level = subsubsub;
				else {
					this.admins[subsub] = {};
					this.admins[subsub].level = subsubsub;
				}
			}

		}
		// 
		// #admin list - lists all admin commands
		// 
		else if (subcommand == "list")
		{
			_.commands.respond(ircdata, "op <nick>, deop <nick>, cl <nick> [clearance-level]");
		}
	},
	die: function () {
		_.fs.writeFile("data/admins.json", JSON.stringify(this.admins, null, 2), function(err) {
			if (err)
				throw "Error saving admin data: " + err;
			else
				console.log("(admin.js) Successfully saved admin data");
		});
	}
}