/*jshint node: true*/


/** NodeIRCBot.js 
  * ====
  * 
  * 1. Defines the entry point for the application.
  * 2. Collects required modules and sets up the TCP connection.
  * 3. Manages standard input.
  * 4. Receives network data and dispatches commands.
**/



// ---------- <Modules> ----------

var config = require("./Config.js") ||
             require("./Config.d.js"); 
var commands = require("./Commands.js"); 
 
// References to variables that get passed around.
var common = {
  net: require('net'),
  os: require('os'),

  output: require('./Logging.js'),
  irc: require('./IRCProtocol.js').irc
};

// Modules that aren't passed around
var connection = require('./Networking.js');
var commands = require('./Commands.js');
var IRCData = require('./IRCData.js').IRCData;

common.config = config; 
var _ = common;

for (var k in common) {
  if (common[k].init) 
    common[k].init(common);
}
// ---------- </Modules> ---------


// ---------- <IRC connection handling> ----------
var onData = function (chunk) {
  // << Receive
  // >> Send
  _.output.log(0, chunk); 

  var datasplit = chunk.split(' '); 


  // << :xsBot!~xsBot@unaffiliated/mniip/bot/xsbot PRIVMSG ###xsbot :+<Sg_Voltage> you can only ...
  // >> PRIVMSG ###xsbot :text
  if (datasplit[1] && datasplit[1] == "PRIVMSG") {
    var hostmask = datasplit[0]; 
    var ircdata = new IRCData(datasplit); 
    if (ircdata.message.words[0].indexOf(_.config.irc.prefix) === 0) {

      // Command sanitization.
      ircdata.command = ircdata.message.words[0]
                      .trim()
                      .substring(_.config.irc.prefix.length)
                      .replace(_.config.behaviour.commandFilter, ""); 
      _.output.log(0, "Received command --> " +ircdata.command);

      if (ircdata.sender.hostmask.indexOf(_.config.irc.owner.hostmatch) != -1)
        ircdata.sender.isOwner = true; 

      if (commands.cmds.hasOwnProperty(ircdata.command)) {
        var result = commands.cmds[ircdata.command].onRun(ircdata); 
        if (result) {
          _.output.log(10, result);
          respondToSender(ircdata, result); 
        }

      }
    }
  }


  // << PING LAG933311021
  // >> :zelazny.freenode.net PONG zelazny.freenode.net :LAG933311021
  if (datasplit[0] && datasplit[0] == "PING") {
    sendRaw("PONG " + datasplit[1]);
  }


  // On kick...
  // << :boxmein!~boxmein@unaffiliated/boxmein KICK ##boxmein boxmein :boxmein
  if (datasplit[1] && datasplit[1] == "KICK") {
    _.output.log(10, "I was kicked from {0}!".format(datasplit[2]));

    if (_.config.irc.autoRejoin) {
      setTimeout(function() {

        sendRaw(_.irc.join(datasplit[2]));

      }, _.config.irc.autoRejoinDelay * 1000);
    }
  }


  // On ban..
  // << :boxmein!~boxmein@unaffiliated/boxmein MODE ##boxmein +b boxmein!*@*
  if (datasplit[1] && datasplit[1] == "MODE" && 
      datasplit[3].indexOf("+") && datasplit[3].indexOf("b")) {
    _.output.log(10, "I was banned from {0}!".format(datasplit[2]));
    _.output.log(10, "Taking no action.");
  }


  // >> NAMES #powder
  // << :zelazny.freenode.net 353 boxmein = #powder :firefreak11 Doxin br34l Halite . . . 
  // << :zelazny.freenode.net 366 boxmein ##boxmein :End of /NAMES list.



  // While banned.
  // << :zelazny.freenode.net 404 boxmein ##boxmein :Cannot send to channel
  // << :zelazny.freenode.net 474 boxmein ##boxmein :Cannot join channel (+b) - you are banned


};

var onDisconnect = function (data) {
  _.output.log(20, "I was disconnected from the IRC!"); 
  process.exit(0); 
};

var onErr = function (error) {

};

var sendRaw = function (raw) {
  _.output.log(1, ">> " +raw); 
  _.conn.write(raw + "\r\n"); 
};
common.sendRaw = sendRaw; 

var respondToSender = function (ircdata, message) {
  sendRaw(_.irc.privmsg(ircdata.channel, ircdata.sender.nick + ": " + message)); 
};
common.respondToSender = respondToSender; 

// ---------- </IRC connection handling> ---------


// ---------- <Standard Input handling> ----------

if (config.behaviour.stdinListen) {
  var stdin = process.openStdin();
  _.output.log(1, "Opened standard input!"); 

  stdin.on('data', function(data) { 
    // feel free to add commands here. 
    _.output.log(0, "Standard input received"); 

    data = data.toString().trim();
    if (data === '') 
      return;
    var args = data.split(" ");
    var cmd  = args.shift();
    // output.log("stdin.onData", "received input: " + data);
    switch (cmd) {
      case "say": 
      case "tell":
      case "privmsg":
        sendRaw(_.irc.privmsg(args.shift(), args.join(" ")));
        break;

      case "raw": 
      case "raw-irc": 
        sendRaw(args.join(" "));
        break;

      case "join": 
      case "join-channel": 
        sendRaw(_.irc.join(args.shift()));
        break;

      case "leave-channel":
      case "part-channel":
      case "part": 
        sendRaw(_.irc.part(args.shift()));
        break;

      case "quit-server": 
      case "quit": 
        sendRaw(_.irc.quit());
        break;

      case "help": 
      case "list": 
        console.log(
        "[--] Help:\n" + 
        "[--] privmsg <chan> <msg> - sends message to channel\n" + 
        "[--] join-channel <chan> - joins a channel\n" +
        "[--] raw-irc <RAW> - sends raw IRC\n[--] join <chan> - joins a channel\n" + 
        "[--] leave-channel <chan> - parts a channel\n[--] quit - quits the server\n" +
        "[--] quit-server - quits the server.\n" +
        "[--] eval-unsafe <javascript> - runs unsafe Javascript");
        break;

      case "eval-unsafe": 
      case "eval": 
        eval(args.join(" "));
        break;
    }
  });

}

// ---------- </Standard Input handling> ---------


// ---------- <Utilities> ----------

String.prototype.trim = function() { // woo stackoverflow
  return this.replace(/^\s+|\s+$/g, "");
};
//first, checks if it isn't implemented yet
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'? 
          args[number] : match;
    });
  };
}

// ---------- </Utilities> ---------



// ---------- <Entry point> ----------

var init = function() {
  _.output.log(0, "Initializing..."); 
  commands.initAll(_); 
  common.conn = connection.connect(_, onData, onDisconnect, onErr); 
  if (config.behaviour.startupMessages) {
    console.log("Running on {0}. \nStarted on {1}"
      .format(_.os.hostname(), (new Date()).toUTCString()));
  }
};
// ---------- </Entry point> ---------


// ---------- <Process stuff> ----------


process.on("exit", function() {
  console.log("----- Exited -----"); 
});


process.on("SIGINT", function() { 
  console.log("^C caught."); 
});


process.on("uncaughtException", function(error) {
  console.log("\033[33;1mCaught uncaught exception: " + error);
  console.log("Stack trace: \n" + error.stack + "\033[0m"); 
});


init(); 