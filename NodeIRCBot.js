/*jshint node: true*/


/** NodeIRCBot.js 
  * ====
  * 
  * 1. Defines the entry point for the application.
  * 2. Requires modules, initializes them and connects to the server.
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
  http: require('http'),

  output: require('./Logging.js'),
  irc: require('./IRCProtocol.js').irc,
  commands: require('./Commands.js')
  /*
  config: configuration,
  sendRaw: function (raw_irc), // sends raw IRC data to server
  respondToSender: function (ircdata, message), // responds to command issuer
  conn: Socket,
  helps: {  // keeps help texts for the help command
      "command": {
        text: "help text",
        param: ["<mandatory parameter>", "[optional parameter]"]
      }
    }

  */
};
var _ = common;

var commands = _.commands; 

// Modules that aren't passed around
var connection = require('./Networking.js');
var IRCData = require('./IRCData.js').IRCData;

_.config = config; 


for (var k in _) {
  if (_[k].init) 
    _[k].init(_);
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
  // 0 => false
  if (datasplit[1] && datasplit[1] == "PRIVMSG") {

    var hostmask = datasplit[0]; 
    var ircdata = new IRCData(datasplit); 

    // ignores
    if (_.config.irc.fastIgnore)
      // that's why I made this (v)
      if (ircdata.sender.nick in _.config.irc.fastIgnores) 
        return false;
    else {
      // asdfg for loops (^)
      for (var i = 0; i < _.config.irc.ignores.length; i++) {
        if (ircdata.sender.hostmask.indexOf(_.config.irc.ignores[i]) != -1) 
          return false; 
      }
    }

    // it's an IRC command
    if (ircdata.message.words[0].indexOf(_.config.irc.prefix) === 0) {

      // Command sanitization.
      ircdata.command = ircdata.message.words[0]
                      .trim() 
                      .substring(_.config.irc.prefix.length) // arbitrary length prefixes!
                      .replace(_.config.behaviour.commandFilter, ""); 

      _.output.log(0, "Received command --> " +ircdata.command);

      if (ircdata.sender.hostmask.indexOf(_.config.irc.owner.hostmatch) != -1)
        ircdata.sender.isOwner = true; 

      if (commands.cmds.hasOwnProperty(ircdata.command)) {

        if (commands.cmds[ircdata.command].disables && 
            commands.cmds[ircdata.command].disables
              .indexOf(ircdata.channel) != -1) {
          _.output.log(2, "Command is disabled in channel: " + ircdata.channel);
          return false;
        }
        var result = commands.cmds[ircdata.command].onRun(ircdata); 
        // commands can return results for a generic response via respondToSender
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
      datasplit[3].indexOf("+") !== -1 && // +qb or whatever, i'm not sure
      datasplit[3].indexOf("b") !== -1) {
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

// called on socket error
var onErr = function (error) {

};

// just raw things
var sendRaw = function (raw) {
  _.output.log(1, ">> " +raw); 
  _.conn.write(raw + "\r\n"); 
};
common.sendRaw = sendRaw; 

// pre-formatted responses, "PRIVMSG #channel :nickname: text"
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

    // just in case...
    data = data.toString().trim();
    if (data === '') 
      return;
    // 'args' in the meaning of 'words'
    var args = data.split(" ");
    var cmd  = args.shift();
    // output.log("stdin.onData", "received input: " + data);
    switch (cmd) {
      // commands have many alternative names

      // say <channel> <text text text> -> PRIVMSG
      case "say": 
      case "tell":
      case "privmsg": 
        sendRaw(_.irc.privmsg(args.shift(), args.join(" ")));
        break;

      // raw <raw raw raw> -> raw IRC sent to the server
      case "raw": 
      case "raw-irc": 
        sendRaw(args.join(" "));
        break;

      // join <channel> -> JOIN channel
      case "join": 
      case "join-channel": 
        sendRaw(_.irc.join(args.shift()));
        break;

      // part <channel> -> PART channel
      case "leave-channel":
      case "part-channel":
      case "part": 
        sendRaw(_.irc.part(args.shift()));
        break;

      // quit -> disconnect
      case "quit-server": 
      case "quit": 
        sendRaw(_.irc.quit());
        break;
      // list -> command list
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

      // eval <javascript code> -> unsafe JS
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
  // sets up all commands and prepares the help text object thingy
  commands.initAll(_); 
  // returns the socket on which to perform writes/reads.
  // sets up event handlers and the rest of the socket wharrgarbl
  common.conn = connection.connect(_, onData, onDisconnect, onErr); 

  // if show startup message
  if (config.behaviour.startupMessages) {
    console.log("Running on {0}. \nStarted on {1}"
      .format(_.os.hostname(), (new Date()).toUTCString()));
  }
};
// ---------- </Entry point> ---------


// ---------- <Process stuff> ----------

// event handlers for various thingies
process.on("exit", function() {
  console.log("----- Exited -----"); 
});


process.on("SIGINT", function() { 
  console.log("^C caught."); 
});

// makes it more persistent but is it worth it? 
process.on("uncaughtException", function(error) {
  console.log("\033[33;1mCaught uncaught exception: " + error);
  console.log("Stack trace: \n" + error.stack + "\033[0m"); 
});

// the one true entry point ^
init(); 