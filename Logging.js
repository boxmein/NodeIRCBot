var _ = null;
var fileHandler = null;
// Output module
// Performs various console output/logging features
// * Colours
// * Logging types
// * Check if some logging is allowed




var output = {
  formatString: "",
  
  init: function(underscore) {
    _ = underscore;
    _.output.log(0, "Initialized output.js");
    if (_.config.logging.toDisk) {
      writelog = function (data) {
        console.log("Not implemented, output.writelog");
      };
    }

    output.setFmtStr(
      // {1} [{2}] {0} ({3}) > {4} \033[0m
      (_.config.logging.datestamp ? "{1}" : "") + 
      (_.config.logging.timestamp ? "[{2}] " : "") +
      (_.config.logging.vividLogs ? "{0} " : "") +
      (_.config.logging.levelstamp? "({3}) " : "") +
      "> {4}" + 
      (_.config.logging.vividLogs ? "\033[0m" : "") );

  },

  // General log messages
  log: function(level, message) {
    var colors, date, time, datemp = new Date();

    if (typeof message !== "string") 
      message = ""+message;
    
    if(_.config.logging.logThreshold < level) {

      if (_.config.logging.vividLogs) {
        if (level < 3) 
          colors = "\033[30;0m";
        else if (level < 10)
          colors = "\033[30;1m";
        else if (level < 50) 
          colors = "\033[36;1m";
        else if (level < 100) 
          colors = "\033[47;30;0m";
      }


      if (_.config.logging.datestamp) {
        date = datemp.getFullYear() + "/" + datemp.getMonth() + "/" + datemp.getDate();
      }

      
      if (_.config.logging.timestamp) {
        time = datemp.getHours() + ":" + datemp.getMinutes() + "." + datemp.getSeconds();
      }
      
      writelog(output.formatString.format(colors, date, time, level, message.trim()));
    }
  },
  setFmtStr: function (str) {
    output.formatString = str; 
  }
};
var writelog = function(data) { // Not to disk
    console.log(data);
};



module.exports = output;

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined' ? 
          args[number] : 
          match;
    });
  };
}
if (!String.prototype.trim) {
  String.prototype.trim = function() { // woo stackoverflow
    return this.replace(/^\s+|\s+$/g, "");
  };
}