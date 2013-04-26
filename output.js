_ = {};
// Output module
// Performs various console output/logging features
// * Colours
// * Logging types
// * Check if some logging is allowed
var output = {
  
  
  init: function(underscore) {
    _ = underscore;
    _.output.log("", "Initialized output.js");
  },
  log: function(sender, message) {
    if (typeof message !== "string") message = ""+message;
    if(!_.config.silent) 
      console.log(col.c(col.black,1) + "[LL] " + sender + ": " + message.trim() + col.r());
  },
  err: function(sender, message) {
    if (typeof message !== "string") message = ""+message;
    console.log(col.c(col.red, 1) + "[EE] " + sender + ": " + message.trim() + col.r());
  },
  out: function(sender, message) {
    if (typeof message !== "string") message = ""+message;
    if(!_.config.silent) 
      console.log(col.c(col.black, 1) + "[>>] " + sender + ": " + message.trim() + col.r());
  },
  inn: function(message) { // typo is on purpose
    if (typeof message !== "string") message = ""+message;
    if(!_.config.silent) 
      console.log("[<<] " + message.trim() + col.r());
  },
  announce: function(message) {
    if (typeof message !== "string") message = ""+message;
    if (!_.config.silent) 
      console.log("[--] --- " + message.trim() + " ---" + col.r());
  },
  chanmsg: function(ircdata) {
    if (!_.config.silent) 
      console.log(col.c(col.white,1) + "[##]<{0}/{1}> {2}".format(ircdata.sender, ircdata.channel, ircdata.message) + col.r());
  },
  alert: function (message) {
    if (!_.config.doublesilent) // Suppresses alerts
      console.log(col.c(col.yellow) + "[!!] " + message + col.r());
  }
};

module.exports = output;

var col = {
  reset          :  0,
  bold           :  1,
  dark           :  2,
  underline      :  4,
  blink          :  5,
  negative       :  7,
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
    return "\033["+ this.reset + "m";
  }
};