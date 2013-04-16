var _ = {};
module.exports = {
	admins: {},
	helptext: {
		base: "admin <subcommand> [arguments] - does admin stuff (depending on clearances!)",
		cmds: {
			"op": "op <user> - gives ops to user (CL:3)",
			"deop": "deop <user> - takes ops from user (CL:3)",
			"kick": "kick <user> - removes user from the channel (CL:1)",
			"kban": "kban <user> - kicks + bans a given user (CL:3)",
			"ban": "ban <user> [time seconds] - bans an user (CL:3)",
			"voice": "voice <user> - gives voice to user (CL:2)",
			"devoice": "devoice <user> - takes voice from user (CL:2)",
			"mode" : "mode <mode> [user] - does mode stuff (CL:3)",
			"topic": "topic <topic> - sets the channel topic (CL:3)",
			"cl": "cl <nick> | cl <nick> <clearance> - gives an user a clearance level (CL:5)",
		}
	}, 
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
		else if (subcommand == "op") {
			
			if (this.admins[ircdata.sender].level < 3)
				throw "Sender has too low clearance (<3)";
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
		else if (subcommand == "deop") {

			if (this.admins[ircdata.sender].level < 3) 
				throw "Sender has too low clearance (<3)";
			var subsub = ircdata.args.shift() || false;
			console.log("admin:exec:deop", "running deop command, subsub:" + subsub);
			if (!subsub) 
				throw "Nobody specified to deop";
			else 
				_.irc.raw("MODE " + ircdata.channel + " -o " + subsub);
		}
		//
		// #admin kick <person> [message] - kicks the specified person off the channel. WIP
		// 
		else if (subcommand == "kick") {
			if (this.admins[ircdata.sender.level] <1)
				throw "Sender has too low clearance (<1)";
			var kickee = ircdata.args.shift() || false;
			if (!kickee)
				throw "Nobody specified to kick";
			var offyougo = ircdata.args.join(" ");
			// KICK #powder-bots #{kickee} 
			// KICK #powder-bots #{kickee} :#{offyougo}
			_.irc.raw("KICK " + ircdata.channel + " " + kickee + (offyougo? " :" + offyougo : ""));
		}
		//
		// #admin kban <person> - kicks AND bans the given person. Also has a time delay.
		//
		else if (subcommand == "kban") {
			if (this.admins[ircdata.sender.level] <3)
				throw "Sender has too low clearance (<3)";
			var kickbannee = ircdata.args.shift() || false;
			if (!kickbannee)
				throw "Nobody specified to kick";
			var time = ircdata.args.shift() || false;
			if (!time)
				time = 0;
			_.irc.raw("KICK " + ircdata.channel + " " + kickbannee);
			_.irc.raw("MODE " + ircdata.channel + " +b " + kickbannee);
			// if time has been set, do the timeout thing. 
			if (time) // MODE ##powder-bots -b #{kickbannee} (after time * 1000 milliseconds)
				setTimeout(function() {_.irc.raw("MODE " + ircdata.channel + " -b " + kickbannee);}, time*1000);			
		}
		//
		// #admin voice <person> - Gives voice to person
		//
		else if (subcommand == "voice") {
			if (this.admins[ircdata.sender.level] <2)
				throw "Sender has too low clearance (<2)";
			var voicee = ircdata.args.shift() || false; 
			if (!voicee) 
				throw "Nobody targeted to voice";
			// MODE ##powder-bots +v #{voicee}
			_.irc.raw("MODE " + ircdata.channel + " +v " + voicee);
		}
		// 
		// #admin devoice <person> - removes voice from a person
		// 
		else if (subcommand == "devoice") {
			if (this.admins[ircdata.sender.level] <2)
				throw "Sender has too low clearance (<2)";
			var voicee = ircdata.args.shift() || false; 
			if (!voicee) 
				throw "Nobody targeted to devoice";
			// MODE ##powder-bots -v #{voicee}
			_.irc.raw("MODE " + ircdata.channel + " -v " + voicee);
		}
		//
		// #admin mode <modestring> - does MODE #current-channel modestring (can do everything above)
		//
		else if (subcommand == "mode") {
		if (this.admins[ircdata.sender.level] <3)
				throw "Sender has too low clearance (<3)";
			var modestring = ircdata.args.join(" ");
			if (!voicee) 
				throw "Nobody targeted to voice";
			// MODE ##powder-bots #{modestring}
			_.irc.raw("MODE " + ircdata.channel + " " + modestring);
		}
		else if (subcommand == "topic") {
			
		}
		//
		// #admin cl <nick> [clearance] - sets a clearance on a nick or returns it
		//
		else if (subcommand == "cl") {
			// If clearance is enough
			if (this.admins[ircdata.sender].level < 5) 
				throw "Sender has too low clearance (<5) ";
			// And there's a sub-subcommand (nickname)
			var nickname = ircdata.args.shift() || false;
			if (!nickname) 
				throw "No nick specified";
			// And there's a clearance level
			var clearance = ircdata.args.shift() || false;
			// Return clearance if exist
			console.log("admin:exec:cl", "running clearance command, nickname: " + nickname + ", clearance:" + clearance);
			if (!clearance) {
				if (this.admins.hasOwnProperty(nickname) && this.admins[nickname].level) 
					_.commands.respond(ircdata, "Clearance: " + this.admins[nickname].level);
			}
			// Set clearance if nonexist
			else {
				try {
					clearance = parseInt(clearance);
				} catch(err) { throw "Can't parse clearance: " + err; }
				if (this.admins.hasOwnProperty(nickname))
					this.admins[nickname].level = clearance;
				else {
					this.admins[nickname] = {};
					this.admins[nickname].level = clearance;
				}
			}
		}
		// 
		// #admin list - lists all admin commands
		// 
		else if (subcommand == "list")
		{
			_.commands.respond(ircdata, "op, deop, kick, ban, kban, voice, devoice, mode, cl, topic");
		}
	},
	die: function () {
		_.fs.writeFile("modules/data/admins.json", JSON.stringify(this.admins, null, 2), function(err) {
			if (err)
				throw "Error saving admin data: " + err;
			else
				console.log("(admin.js) Successfully saved admin data");
		});
	}
}