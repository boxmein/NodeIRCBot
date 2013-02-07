
// @language ECMASCRIPT5
// ^Closure thing

// When everything falls apart
// Just don't back down
// Just keep running
// Just look ahead
// You might be losing but you're not dead

// IRC bot core

// WARNING: BEFORE PASTING TO GIST REMOVE config.js
var net = require("net");
var http = require("http");
var sys = require("sys");

var commands = require("./commands.js"); // Channel commands
var config   = require("./config.js");   // Configuration
var output   = require("./output.js");   // Output formatting
var irc      = require("./irc.js");      // IRC wrappers

output.log("","[--] -------------------------------");
output.log("","[--] Boxmein's node IRC bot started.");
output.log("","[--] -------------------------------");

var allOK = commands.verify() && config.verify() && output.verify() && irc.verify();
var connection = {
  client: new net.Socket(),
  PORT: 6667,
  HOST: "irc.freenode.net",
  textlogging: true, // If we log regular messages like <nick/#chan> Message
  rawlogging: false,
  onConnected: function() { // we are connected!
    irc.setClient(connection.client);
    commands.setIRC(irc);
    console.log(allOK ? "[##] All modules loaded" : "\033]31;1m[EE] Some modules not found") ;
    if (!allOK) process.exit(1);
    output.log("irc.onConnected", "Connection successful");
    output.announce("Press q + enter to exit program.");
    setTimeout(function() {
      irc.raw("NICK " + config.nickname);
      irc.raw("USER " + config.nickname + " 8 * :" + config.realname);
      irc.raw("JOIN " + config.channels);
    }, 7000);
  },
  handleCommands: function(ircdata) {
    output.inn(ircdata.sender + "(in " + ircdata.channel +") called for: " + ircdata.message);
    ircdata.command = ircdata.args.shift().substring(1).trim().replace(/[^A-Za-z]+?/gi, ""); 
    // commands.cmdlist is now chief in executive for testing whether a command exists
    if (commands.cmdlist.hasOwnProperty(ircdata.command)) {
      commands[ircdata.command](ircdata); 
    }
    else 
      output.err("irc.onData", ircdata.command+" is not a command.");
  },
  onData: function(data) {
    if(output.rawlogging)
        output.log("<>",data);
    if (data.indexOf("PRIVMSG ") != -1) { // Channel message
      var arr = data.split(' ');   // Creates an array with 
      var result = arr.splice(0,3);// ["hostmask", "command", "channel", "mess age"]
      result.push(arr.join(' '));

      var ircdata = {
        hostmask : result[0].substring(1),                         // Sender's hostmask
        channel  : result[2],                                      // Sender's channel
        sender   : result[0].substring(1, result[0].indexOf("!")), // Sender's handle
        message  : result[3].substring(1).trim(),                    // Full message
      };
      if (output.textlogging)
        output.chanmsg(ircdata);
      ircdata.args = ircdata.message.split(" ");
      if (ircdata.message.indexOf(commands.prefix) == 0) {
        connection.handleCommands(ircdata);
      }
    }
    else if(data.indexOf("PING") != -1) { // Ping-pong handling
      irc.raw("PONG", true); // Disables its logging.
    }
    else if(data.indexOf("NOTICE") != -1) { // Server notices
      var arr = data.split(' ');   // Creates an array with 
      var result = arr.splice(0,3);// ["hostmask", "command", "channel", "mess age"]
      result.push(arr.join(" ").trim());
      var noticedata = {
        hostmask: result[0].substring(1),
        sender: result[0].substring(1, result[0].indexOf("!")),
        message: result[3].substring(1),

      }
      if (noticedata.hostmask.indexOf("freenode.net") == -1)
        output.inn("-"+noticedata.sender+"- :" +noticedata.message.trim());
      if (noticedata.sender == "NickServ") {
        output.log("connection.onData", "NickServ sent me");
        if (noticedata.message.indexOf("identify") != -1) {
          output.log("connection.onData", "Identifying quick!");
          irc.privmsg("NickServ", "IDENTIFY " + config.pass, true);
        }
      }
    }
  },
  onConnectionClose: function() { // If the server disconnects us
    output.err("irc.onConnectionClose", "Disconnected ()");
    process.exit(0);
  }
};


String.prototype.trim = function() { // woo stackoverflow
  return this.replace(/^\s+|\s+$/g, "");
};
//first, checks if it isn't implemented yet
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

connection.client.setEncoding("ascii");
connection.client.setNoDelay();
connection.client.connect(connection.PORT, connection.HOST, connection.onConnected);
var stdin = process.openStdin();

connection.client.on("data", connection.onData);
connection.client.on("close", connection.onConnectionClose);
stdin.on('data', function(data) { 
  // feel free to add commands here. 
  data = data.toString().trim();
  if (data == "") 
    return;
  var args = data.split(" ");
  var cmd  = args.shift();
  // output.log("stdin.onData", "received input: " + data);
       if(cmd == "say") 
    irc.privmsg(args.shift(), args.join(" "));
  else if(cmd == "raw") 
    irc.raw(args.join(" "));
  else if(cmd == "join") 
    irc.join(args.shift());
  else if(cmd == "part") 
    irc.part(args.shift());
  else if(cmd == "quit")
    irc.quit();
  else if(cmd == "tlogging")
    config.textlogging = !config.textlogging;
  else if(cmd == "help") 
  {
    console.log(
      "[--] Help:\n" + 
      "[--] say <chan> <msg> - sends message to channel\n" + 
      "[--] raw <RAW> - sends raw IRC\n[--] join <chan> - joins a channel\n" + 
      "[--] part <chan> - parts a channel\n[--] quit - quits the server\n" +
      "[--] tlogging - toggles text logging");

  }
});