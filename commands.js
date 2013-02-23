
var http = require("http");
var output = require("./output.js");
var config = require("./config.js");
var Sandbox = require("sandbox"), s = new Sandbox();
var DOMParser = require("xmldom").DOMParser;

// Warning! The commands below need ../ for core bot modules! 
var crypto = require("./cmdsubmodules/cryptography.js");
var quotes = require("./cmdsubmodules/quotes.json");
//var nickometer = require("./cmdsubmodules/nickometer.js");
var commands = {
  verify: function() { // Is called on connecting. Return true. Use for initialization.
    cmdpr.reloadList();

    return (!!(crypto) && !!(quotes));
  },
  setIRC: function(ircc) { commands.irc = ircc; },
  prefix: "#",
  quote: function(ircdata) {
    if (ircdata.args[0]) {
      try { var index = parseInt(ircdata.args[0]); }
      catch (err) { output.err("Inserted value was not an int! :" + ircdata.args[0]);
                  var index = Math.floor(Math.random() * 20) % quotes.q.length; }
    }
    else {
      var index = Math.floor(Math.random() * 20) % quotes.q.length;
    }
    var current = quotes.q[index];
    output.log("commands.quote", "Quote index:" + current);
    output.log("commands.quote", "Sending quote: " + current);
    cmdpr._respond(ircdata, current);
  },
  crypt: function(ircdata) {
    var subcommand = ircdata.args.shift(),
    key = null,
    plaintext = "",
    reverse = false;
    // Caesar crypt needs a shift counter
    if (subcommand == "caesar") {
                try { key = parseInt(ircdata.args.shift()); }
        catch (err) { output.err("Key " + key + " was not parsable!"); }
        plaintext = ircdata.args.join(" ");
        crypto.caesar(key, plaintext);
    }
    else if(subcommand == "rot13") {
        plaintext = ircdata.args.join(" ");
        crypto.rot13(plaintext);
    }
    else if(subcommand == "otp") {
        return;
        key = ircdata.args.shift();
        if (key.indexOf("-") == 0)
          reverse = true;
        plaintext = ircdata.args.join(" ");
        crypto.otp(key, plaintext, reverse);
    }
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
      output.err("commands.help", "command was either not found or empty string");
  },
  version: function(ircdata) { // version - id string
    cmdpr._respond(ircdata, "boxmein's bot in node.js : https://github.com/boxmein/NodeIRCBot");
  },
  isowner: function(ircdata) { // isowner - if the sender is the owner of the bot. 
    cmdpr._respond(ircdata, cmdpr._isowner(ircdata));
  },
  js: function(ircdata) { // js <code> - makes javascript
    if (cmdpr._isowner(ircdata)) {
      var js = ircdata.args.join(" ");
      output.log("commands.js", "JS: " + js);
      var response = "";
      try {
        response = "[return]: " + eval("(function() {" + js + "})();");
      }
      catch (error) {
        response = "[Broken syntax]";
        output.err("commands.js", "Error: " + error);
      } 
      output.log("commands.js", "JS METHOD CALL ENDED");
      cmdpr._respond(ircdata, response);
    }
    else {
      output.log("commands.js", "Entering SAFE BLOCK!");
      try {
        cmdpr.sandboxJS(ircdata);
      }
      catch (err) {
        output.err("commands.js", "Error in sandbox: " + err);
      }
    }
  },
  stm: function(ircdata) { // sendtomniip <nick> <msg> - makes a HTTP request as mniip's
    output.log("commands.sendtomniip", "Starting HTTP request");
    var message = ircdata.args.join(" ");
    if (message != "") {
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
  lastfm: function(ircdata) {
    var endstr = "";
    function parseReceived(data) {
      output.log("commands.lastfm", "Parsing data: " + data);
      var xmlobj = {};
      try { 
        var xmlparse = new DOMParser();
        xmlobj = xmlparse.parseFromString(data);
        
      } 
      catch(err) { output.err("commands.lastfm", "error parsing XML: "+err); return;}
      
      if (xmlobj.getElementsByTagName("lfm")[0].getAttribute("status") != "ok") {
        output.err("commands.lastfm", "Returned bad status " + xmlobj.getElementsByTagName("lfm")[0].status);
        return;
      }
      var track = xmlobj.getElementsByTagName("track")[0];
      endstr += (track.nowplaying == "true" ? "Now Playing: " : "Last Played: ");
      endstr += track.getElementsByTagName("artist")[0].textContent + " - ";
      endstr += track.getElementsByTagName("name")[0].textContent; 
      output.log("commands.lastfm", "End string: " + endstr);
      cmdpr._respond(ircdata, endstr);

    }
    var username = ircdata.args[0] || false;
    if (!username) return;
    var req = http.request( 
      {
        hostname: "ws.audioscrobbler.com",
        path: "/2.0/?method=user.getRecentTracks&limit=2&api_key="+config.lastFM.apiKey+"&user="+username,
        method: "GET",
        headers: {
          "User-Agent": "boxnode IRC Bot (@ "+ config.server+", contact " + config.ownerEmail + ")",
          "X-Powered-By": "Node.js v0.8.16",
          "Accept": "application/json"
        }
      }, function(response) {
        output.inn("statusCode: " + response.statusCode);
        if (response.statusCode == 200)
        { 
          output.log("commands.lastfm","Data received: parsing.");
          response.setEncoding("utf8");
          response.on("data", function(chunk) {
            parseReceived(chunk);
          });
        }
        else 
          output.err("commands.lastfm", "Response not 200 ;_;"); 
    });
    req.on("error", function(evt) { output.err("commands.lastfm", evt.message); });
    req.end();
  },
  lfm: function(ircdata) { commands.lastfm(ircdata); },
  tptthumb: function(ircdata) {
    var index = ircdata.args[0];
    if (/[0-9]{1,10}/.test(index)) {
      cmdpr._respond(ircdata, "http://static.powdertoy.co.uk/" + index + ".png");
    }
    else
      output.err("commands.tptthumb", "Sent ID was not a number: " + index);
  },
  cmdlist: {
    // Using this list is mandatory now! 
    "help": "help <cmd> - shows you help on a command",
    "eat" : "eat <user> | eat - eats another user or you",
    "time": "time - gives my current time", 
    "list": "list - lists all commands",
    "ping": "ping - Responds with pong ASAP",
    "help": "help <command> - help text on a topic",
    "js": "js <javascript> - run javascript",
    "version": "version - gives you version and my git link", 
    "isowner": "isowner - check whether or not you're the owner",
    "stm": "stm <nick> <message> - send a message to make xsbot say it out",
    "crypt": "crypt <method=otp,caesar,rot13> <key/shift> <plaintext> - Encrypt text",
    "quote": "quote - Returns a random quote from my database",
    // "tptversion": "tptversion - Returns the current The Powder Toy version",
    "tptthumb": "tptthumb <id> - Returns a TPT thumbnail ID",
    "lastfm": "lastfm <nickname> - returns what the user is now playing",
    "lfm": "see `lastfm`"
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
  sandboxJS: function(ircdata) {
    output.log("cmdpr.sandboxJS", "Running sandboxed JS interpreter...");
    var js = ircdata.args.join(" ");
    output.log("cmdpr.sandboxJS", "JS: " + js);
    s.run(js, function(out) {
      cmdpr._respond(ircdata, "[return]: " + out.result);
    });
  },
  commands: []
};