//
// Badwords module
// Experimental and probs useless, butt fun
//
var _ = {};
module.exports = {
	scan: function (ircdata) {
		var msg = ircdata.message.split();
		_.config.badwords.words.map(function(each) {
			if (msg == each)
				return each;
		});
		return false;
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



