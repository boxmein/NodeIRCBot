// Arguments named after original code.
// str = original string of text.
// form = ?
// lev = gibberishification level. 1..6 or more?
var output = require("../output.js");
var markov = {
	generate: function(str, form, lev)
	{

		// Clear output.
		var returnValue = "";

		// Make the string contain two copies of the input text.
		// This allows for wrapping to the beginning when the end is reached.
		str = str + " ";
		var nchars = str.length;
		str = str + str;

		// Check input length.
		if (nchars < lev) {
			output.err("markov.generate","Too few input characters.");
			return;
		}

		// Pick a random starting character, preferably an uppercase letter.
		for (i = 0; i < 1000; i++) {
			ichar = Math.floor(nchars * Math.random());
			chr = str.charAt(ichar);
			if ((chr >= "A") && (chr <= "Z"))
			  break;
	  }

		// Write starting characters.
		returnValue = returnValue + str.substring(ichar, ichar + lev);

		// Set target string.
		target = str.substring(ichar + 1, ichar + lev);

		// Generate characters.
		// Algorithm: Letter-based Markov text generator.
		for (i = 0; i < 500; i++) {
			if (lev == 1) {
				// Pick a random character.
				chr = str.charAt(Math.floor(nchars * Math.random()));
			} else {
				// Find all sets of matching target characters.
				nmatches = 0;
				j = -1;
				while (true) {
					j = str.indexOf(target, j + 1);
					if ((j < 0) || (j >= nchars)) {
						break;
					} else {
						nmatches++;
					}
				}

				// Pick a match at random.
				imatch = Math.floor(nmatches * Math.random());

				// Find the character following the matching characters.
				nmatches = 0;
				j = -1;
				while (true) {
					j = str.indexOf(target, j + 1);
					if ((j < 0) || (j >= nchars)) {
						output.log("markov.generate", "Time to end some last loop");
						break;
					} else if (imatch == nmatches) {
						output.log("markov.generate", "Match was okay, now returning");;
						chr = str.charAt(j + lev - 1);
						break;
					} else {
						nmatches++;
					}
				}
			}

			// Output the character.
			returnValue = returnValue + chr;
			output.log("markov.generate", "New return value is: " + returnValue);
			// Update the target.
			if (lev > 1) {
				target = target.substring(1, lev - 1) + chr;
			}
		}
		return returnValue;
	}
}
module.exports = markov;