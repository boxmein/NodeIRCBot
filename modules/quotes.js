var _ = {};
module.exports = {
	helptext: "quote [id] - shows a quote from my database; quote count - tells you how many quotes I have", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		console.log("Initialised quotes.js");
	},
	exec: function(ircdata) {
		try {
			var index = ircdata.args[0] || false;
			if (!ircdata.args[0]) {
				index = Math.round(Math.random() * quotes.length);
			}
			else {
				// Will be caught outside the throw anyways
				if (index == "count") 
					_.commands.respond(ircdata, "I have " + quotes.length + " quotes in my database.");
				index = parseInt(ircdata.args[0]);
			}
			if (quotes[index]) 
					_.commands.respond(ircdata, quotes[index]);
			else
				throw "No quote with this id :(";
		}
		catch (err) { // Catch seems mandatory so let's rethrow it anyways
			throw err;
		}
	}
}
var quotes = [
	"If you can't be criticized for it, it's probably not remarkable. Are you devoting yourself to something devoid of criticism? ~ Unknown",
	"You are afraid to die, and you're afraid to live. What a way to exist. ~ Neale Donald Walsch",
	"Do the right thing. You'll ratify your friends and astonish your enemies. ~ Mark Twain",
	"Never let formal education get in the way of your learning. ~ Mark Twain",
	"I don't want your damn lemons! What am I supposed to do with THESE? ~ Cave Johnson", 
	"When life gives you lemons, don't make lemonade! Make life take the lemons back! ~ Cave Johnson",
	"I like offending people, because I think people who get offended should be offended. ~ Linus Torvalds",
	"You don't need to wait until Valentine's Day to show someone how much they mean to you. ~ Anon",
	//"Everyone is gay for Robert Downey Jr. ~ /u/Sortech",
	"Before you criticize someone, you should walk a mile in their shoes. That way, when you do criticize them, you're a mile away from them and you have their shoes. ~ Jack Handey",
	"Poets have been mysteriously silent on the subject of cheese. ~ G.K. Chesterton ",
	"2013-02-15 [00:34.14] <Lockheedmartin> You can't stop me! I'm a train!",
	"2013-03-14 [19:59.51] <Tudor> that moment when you go into a cave to mine iron ore / and accidentally hit and get attacked by a passive agressive flying mini white whale that lets sparkles under it / and teleports",
	"2013-03-14 [12:00.29] <Poorsoft> Most male fashion designers are gay, by my observations,",
	"2013-01-29 [17:19.44] * Ristovski eats the \"stick\" // wait.. eww, that sounded wrong"

]