//
// Badwords module
// Experimental and probs useless, butt fun
//
var _ = {};
module.exports = {
	scan: function (ircdata) {
		//_.output.log("badword.scan", "Doing scan on badwords...");
		var msg = ircdata.message.split();
		return _.config.badwords.words.map(function(each) {
			if (msg == each) {
				_.output.log("badword.scan","Found badword: " + each);
				return ""+each;
			}
		}) || false;
		
	},
	announce: function (ircdata, word) {
		_.output.log("badword.announce", "Found badword in "+ircdata.channel+"/"+ircdata.sender+", he said " + word);
		_.commands.respond(ircdata, "ugh badwords: " + word);
	},
	init: function (underscore) {
		_ = underscore;
		console.log("Initialised badword.js");
	}
};



