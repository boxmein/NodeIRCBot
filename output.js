
var config = require("./config.js");
var output = {
  textlogging: true,
  rawlogging: false,
  verify: function() { return true},
  log: function(sender, message) {
    if(!config.silent) console.log("[LL] " + sender + ": " + message);
  },
  err: function(sender, message) {
    console.log("[EE] " + sender + ": " + message);
  },
  out: function(sender, message) {
    if(!config.silent) console.log("[>>] " + sender + ": " + message);
  },
  inn: function(message) { // typo is on purpose
    if(!config.silent) console.log("[<<] " + message);
  },
  announce: function(message) {
    if (!config.silent) console.log("[--] --- " + message + " ---")
  },
  chanmsg: function(ircdata) {
    if (!config.silent) console.log("[##]<{0}/{1}> {2}".format(ircdata.sender, ircdata.channel, ircdata.message));
  }
}
module.exports = output;