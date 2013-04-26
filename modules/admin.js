var _ = {};
module.exports = {
	// Admin object, keeps references that are loaded
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
			"cl": "cl <nick> | cl <nick> <clearance> - gives an user a clearance level (CL:5)"
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
		console.alert("Admin command: ", "sender: " + ircdata.sender + "; sub: " + subcommand);
		if (!subcommand)
			throw "No subcommand specified";


		// MODE #channel +-mode name
		//
		// #admin op <nick> - gives ops to hostmask
		//
		else if (subcommand == "op") {
			
			if (this.admins[ircdata.sender].level < 3)
				throw "Sender has too low clearance (<3)";
			var to_op = ircdata.args.shift() || false;
			console.log("admin:exec:op", "running op command: to_op:" + to_op);
			if (!to_op) 
				throw "No hostmask specified";
			else 
				_.irc.raw("MODE " + ircdata.channel + " +o " + to_op);
		}


		//
		// #admin deop <nick> - takes ops from hostmask
		// 
		else if (subcommand == "deop") {

			if (this.admins[ircdata.sender].level < 3) 
				throw "Sender has too low clearance (<3)";
			var to_deop = ircdata.args.shift() || false;
			console.log("admin:exec:deop", "running deop command, to-deop:" + to_deop);
			if (!to_deop) 
				throw "Nobody specified to deop";
			else 
				_.irc.raw("MODE " + ircdata.channel + " -o " + to_deop);
		}


		//
		// #admin kick <person> [message] - kicks the specified person off the channel. WIP
		// 
		else if (subcommand == "kick") {

			if (this.admins[ircdata.sender.level] <1)
				throw "Sender has too low clearance (<1)";

			var to_kick = ircdata.args.shift() || false;

			if (!to_kick)
				throw "Nobody specified to kick";

			var ban_note = ircdata.args.join(" ");
			// KICK #powder-bots #{to_kick} 
			// KICK #powder-bots #{to_kick} :#{ban_note}
			_.irc.raw("KICK " + ircdata.channel + " " + to_kick + 
				(ban_note? 
					" :" + ban_note : 
					""
				)
			);
		}


		//
		// #admin kban <person> - kicks AND bans the given person. Also has a time delay.
		//
		else if (subcommand == "kban") {

			if (this.admins[ircdata.sender.level] <3)
				throw "Sender has too low clearance (<3)";

			var to_kban = ircdata.args.shift() || false;
			if (!to_kban)
				throw "Nobody specified to kick";

			var time = ircdata.args.shift() || false;
			if (!time)
				time = 0;

			_.irc.raw("KICK " + ircdata.channel + " " + to_kban);
			_.irc.raw("MODE " + ircdata.channel + " +b " + to_kban);

			// if time has been set, do the timeout thing. 
			if (time) { // MODE ##powder-bots -b #{to_kban} (after time * 1000 milliseconds)
				setTimeout(
					function() {
						_.irc.raw("MODE " + ircdata.channel + " -b " + to_kban);
					}, 
				time*1000);
			}			
		}


		//
		// #admin voice <person> - Gives voice to person
		//
		else if (subcommand == "voice") {
			if (this.admins[ircdata.sender.level] <2)
				throw "Sender has too low clearance (<2)";

			var to_voice = ircdata.args.shift() || false; 

			if (!to_voice) 
				throw "Nobody targeted to voice";
			// MODE ##powder-bots +v #{to_voice}
			_.irc.raw("MODE " + ircdata.channel + " +v " + to_voice);
		}


		// 
		// #admin devoice <person> - removes voice from a person
		// 
		else if (subcommand == "devoice") {
			if (this.admins[ircdata.sender.level] <2)
				throw "Sender has too low clearance (<2)";
			var to_devoice = ircdata.args.shift() || false; 
			if (!to_devoice) 
				throw "Nobody targeted to devoice";
			// MODE ##powder-bots -v #{to_devoice}
			_.irc.raw("MODE " + ircdata.channel + " -v " + to_devoice);
		}


		//
		// #admin mode <modestring> - does MODE #current-channel modestring (can do everything above)
		//
		else if (subcommand == "mode") {
		if (this.admins[ircdata.sender.level] <3)
				throw "Sender has too low clearance (<3)";
			var modestring = ircdata.args.join(" ");
			// MODE ##powder-bots #{modestring}
			_.irc.raw("MODE " + ircdata.channel + " " + modestring);
		}


		// 
		// #admin topic <topic to the end> - Sets the channel topic. 
		//
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

			// Return clearance if not passed
			if (!clearance) {
				if (this.admins.hasOwnProperty(nickname) && 
					this.admins[nickname].level) 
					_.commands.respond(ircdata, "Clearance: " + this.admins[nickname].level);
			}


			// Set clearance if passed
			else {
				try {
					clearance = parseInt(clearance, 10);
				} 
				catch(err) { 
					throw "Can't parse clearance: " + err; 
				}

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
	// Saves admin properties.
	die: function () {
		_.fs.writeFile("modules/data/admins.json", 
			JSON.stringify(this.admins, null, 2), 
			function(err) {
				if (err)
					throw "Error saving admin data: " + err;
				else
					_.output.log("admin.js","Successfully saved admin data");
			});
	}
};