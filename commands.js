
var output = require("./output.js");
var config = require("./config.js");
var crypto = require("./cryptography.js");
var commands = {
  verify: function() { // Is called on connecting. Return true. Use for initialization.
    cmdpr.reloadList();
    return true
  },
  setIRC: function(ircc) { commands.irc = ircc; },
  prefix: "#",
  crypt: function(ircdata) {
    if (ircdata.args.length < 3)
    {
      // Send the help text
      ircdata.args[0] = "crypt";
      commands.help(ircdata);
      return;
    }
    var subcommand = ircdata.args[0];
    if (typeof crypto[subcommand] == "undefined") {
      output.err("commands.crypt", "No such crypt subcommand: " + subcommand);
      cmdpr._respond(ircdata, "No such crypto method: " + subcommand);
    }
    output.log("commands.crypt", "found crypto subcommand: " + subcommand);
    output.log("commands.crypt", "calling with key: " + ircdata.args[1] + " & plain: " + ircdata.args[2]);
    cmdpr._respond(ircdata, crypto[subcommand](ircdata.args[1], ircdata.args[2]));
  },
  eat: function(ircdata) { // eat <user> | eat - eats the user or the sender
    output.log("commands.eat", "Eating an user.");
    commands.irc.action(ircdata.channel, "eats " + (
                ircdata.args[0] != "" 
                ? ircdata.args[0].trim() 
                : ircdata.sender) );
  },
  time: function(ircdata) { // time - shows time in my zone
    var d = new Date(Date.now());
    output.log("commands.time", "Doing commands.time");
    cmdpr._respond(ircdata, d.getHours() + ":" + d.getMinutes());
  },
  list: function(ircdata) { // list - lists all commands
    var keys = [];

    cmdpr._respond(ircdata, "" + cmdpr.commands.join(", ").trim());
  },
  ping: function(ircdata) { // ping - responds with pong
    cmdpr._respond(ircdata, "pong!")
  },
  help: function(ircdata) { // help - helps with the functionality
    var requested = (ircdata.args[0] || "help").trim();
    if(commands.cmdlist.hasOwnProperty(requested)
      && requested.indexOf("_") == -1) {
      output.log("commands.help", "command was found");
      cmdpr._respond(ircdata, commands.cmdlist[requested]);
    }
    else 
      output.log("commands.help", "command was either not found or empty string");
  },
  version: function(ircdata) { // version - id string
    cmdpr._respond(ircdata, "boxmein's bot in node.js : https://gist.github.com/4644761");
  },
  isowner: function(ircdata) { // isowner - if the sender is the owner of the bot. 
    cmdpr._respond(ircdata, cmdpr._isowner(ircdata));
  },
  js: function(ircdata) { // js <code> - makes javascript
    output.log("commands.js", "JS METHOD CALL STARTED");
    if (cmdpr._isowner(ircdata)) {
      output.log("commands.js", "Sender is the owner! Executing...");
      output.log("commands.js", "JS: " + ircdata.args.join(" "));
      var response = "";
      try {
        response = "[return]: " + eval("(function() {" + ircdata.args.join(" ") + "})();");
      }
      catch (error) {
        response = "[Broken syntax]";
      }
      output.log("commands.js", response);  
      output.log("commands.js", "JS METHOD CALL ENDED");
      cmdpr._respond(ircdata, response);
    }
  },
  stm: function(ircdata) { // sendtomniip <nick> <msg> - makes a HTTP request as mniip's
    output.log("commands.sendtomniip", "Starting HTTP request");
    if (ircdata.args[0] != "") {
      var message = "";
      if (ircdata.args.length > 2) {
        message = ircdata.args.splice(1, ircdata.args.length -1).join(" ");
        output.log("commands.sendtomniip", "(0) message: " + message);
      }
      else if(ircdata.args[1] != "" && ircdata.args[1] != undefined) {
        message = ircdata.args[1];
        output.log("commands.sendtomniip", "(1) message: " + message);
      }
      else {
        message = "disregard that, I suck cocks";
      }
      var req = http.request(
        // Object with all the details
      {
        hostname: "mniip.com", 
        path: "/bot.lua?nick=" + ircdata.args[0] + "&msg=" + encodeURIComponent(message), 
        method: "GET", 
        headers: {
          "User-Agent": "boxnode@" + ircdata.channel,
          "X-Powered-By": "lolcats"
        }
      },
      // When the response comes by
       function(response) {
        output.log("commands.sendtomniip", "Status: " + response.statusCode);
        output.log("commands.sendtomniip", "Headers: " + JSON.stringify(response.headers, null, "\t"));

        // Might need to be in here
        req.on("error", function(evt) {
          output.err("commands.sendtomniip", evt.message);
        });
      });
      req.end();
    }
    output.log("commands.sendtomniip", "Ending function body");
  },
  cmdlist: {
    // Using this list is mandatory now! 
    "help": "help <cmd> - shows you help on a command",
    "eat" : "eat <user> | eat - eats another user or you",
    "time": "time - gives my current time", 
    "list": "list - lists all commands",
    "ping": "ping - Responds with pong ASAP",
    "help": "help <command> - help text on a topic",
    "js": "js <javascript> - run javascript [owner only]",
    "version": "version - gives you version and my gist link", 
    "isowner": "isowner - check whether or not you're the owner",
    "stm": "stm <nick> <message> - send a message to make xsbot say it out",
    "crypt": "crypt <method=otp,caesar,rot13> <key/shift> <plaintext> - Encrypt text"
  },
};
module.exports = commands;
// Commands: Private data
var cmdpr = {
  // Send a channel response
  _respond: function(ircdata, message) {
      commands.irc.privmsg(ircdata.channel, ircdata.sender + ": " + message);
  }, 
  // Verify if someone's an owner
  _isowner: function(ircdata) {
    var isowner = (ircdata.hostmask.indexOf(config.owner) != -1);
    output.log("cmdpr._isowner", "user "+ircdata.sender+ (isowner ? " is owner" : " isn't owner"));
    return isowner;
  },
  // Add a new command
  _add: function(commandname, helptext, callback) {
    commands.cmdlist[commandname] = helptext; // Add its help text
    commands[commandname] = callback;         // Add function body
    cmdpr.reloadList();
  },
  // Reload command lists
  reloadList: function() {
    cmdpr.commands = [];
    for (var k in commands.cmdlist)
      cmdpr.commands.push(k);
    output.log("cmdpr.reloadList", "Command list reloaded.");
  },
  commands: []
};