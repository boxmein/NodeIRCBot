var config = require("./config.js");
// Output module
// Performs various console output/logging features
// * Colours
// * Logging types
// * Check if some logging is allowed
var output = {
  textlogging: true,
  rawlogging: false,
  verify: function() { return true },
  log: function(sender, message) {
    if(!config.silent) console.log(col.c(col.black,1) + "[LL] " + sender + ": " + message.trim() + col.r());
  },
  err: function(sender, message) {
    console.log(col.c(col.red, 1) + "[EE] " + sender + ": " + message.trim() + col.r());
  },
  out: function(sender, message) {
    if(!config.silent) console.log(col.c(col.black, 1) + "[>>] " + sender + ": " + message.trim() + col.r());
  },
  inn: function(message) { // typo is on purpose
    if(!config.silent) console.log("[<<] " + message.trim() + col.r());
  },
  announce: function(message) {
    if (!config.silent) console.log("[--] --- " + message.trim() + " ---" + col.r())
  },
  chanmsg: function(ircdata) {
    if (!config.silent) console.log(col.c(col.white,1) + "[##]<{0}/{1}> {2}".format(ircdata.sender, ircdata.channel, ircdata.message) + col.r());
  }
};

module.exports = output;

var col = { // ANSI escape colours. Not all of the below work on windows.
  reset          :  0, // Back to the ordinary colour
  bold           :  1, // Makes some colours brighter.
  dark           :  2, // ?
  underline      :  4,
  blink          :  5,
  negative       :  7, // Reverse video!
  black          : 30,
  red            : 31,
  green          : 32,
  yellow         : 33,
  blue           : 34,
  magenta        : 35,
  cyan           : 36,
  white          : 37,
  c: function(color, gmode) {
    return "\033["+ color + (gmode? ";" + gmode : "") + "m";
  },
  r: function() {
    return "\033[" + col.reset + "m";
  }
}
String.prototype.trim = function() { // woo stackoverflow
  return this.replace(/^\s+|\s+$/g, "");
};