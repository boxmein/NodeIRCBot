/*jshint node: true */

// When everything falls apart
// Just don't back down
// Just keep running
// Just look ahead
// You might be losing but you're not dead
var _ = {
  // 
  // All the requirements of this program are here.
  // The _ object is passed around for references.
  // Some modules may require modules themselves. 
  //
  net : require("net"),
  http : require("http"),
  fs: require("fs"),
  cp: require("child_process"),
  os: require("os"),

  output   : require("./output.js"),
  config   : require("./config.js"),
  commands : require("./commands.js"),
  irc      : require("./irc.js"),

  Sandbox  : require("sandbox"),          
  DOMParser: require("xmldom").DOMParser,
  adminData: require("./modules/data/admins.json")
};


var connection = {
  // 
  // Here lies everything to do with connecting to the IRC.
  // 
  client: new _.net.Socket(),
  PORT: 6667,
  HOST: _.config.server,
  onConnected: function() { // we are connected!
    
    _.output.init(_); // output > everything
    _.commands.init(_);
    _.irc.init(_);
    //_.badwords.init(_);
    _.irc.setClient(connection.client);

    _.output.log("irc.onConnected", "Connection successful");
    _.output.announce("Use 'quit' to exit this program. I'd prefer #owner quit.");

    setTimeout(function() {
      _.irc.raw("NICK " + _.config.nickname);
      _.irc.raw("USER " + _.config.nickname + " 8 * :" + _.config.realname);
      _.irc.raw("JOIN " + _.config.channels);
    }, 7000);
  },
  handleCommands: function(ircdata) {
    _.output.inn(ircdata.sender + "(in " + ircdata.channel +") called for: " + ircdata.message);
    ircdata.command = ircdata.args.shift().substring(1).trim().replace(/[^A-Za-z]+?/gi, ""); 
    // commands.cmdlist is now chief in executive for testing whether a command exists
    try {
      _.commands.exec(ircdata);
    }
    catch (err) { 
      _.output.alert("c:" + ircdata.command + " -> " + err); 
      if (_.config.loud) {
        _.commands.respond(ircdata, err);
      }
    }
  },
  onData: function(data) {
    if(_.config.rawlogging)
        _.output.log("",data);

    // Channel messages and commands
    if (data.indexOf("PRIVMSG ") != -1) { 

      // 1. Cut up data into a nicer array
      var arr = data.split(' ');   
      var result = arr.splice(0,3);
      result.push(arr.join(' '));
      // result = ["hostmask", "command", "channel", "mess age"]

      // 2. Create the ever-so-useful ircdata object
      var ircdata = {
        hostmask : result[0].substring(1),
        channel  : result[2],
        sender   : result[0].substring(1, result[0].indexOf("!")),
        message  : result[3].substring(1).trim(),
        messageType: 0 // 0000 = Channel message. 0001 = PM. 0010 = CTCP message
      };
      // 3. messageType + special occasions
      if (ircdata.channel == _.config.nick) { // Then he's PMing!
        ircdata.messageType |= 1;
        ircdata.channel = ircdata.sender;
      }
      if (/.+\x01.+\x01$/g.test(ircdata.message)) // CTCP messages go \x01 + message + \x01
        ircdata.messageType |= 2;
      
      // 4. Logging
      if (_.config.textlogging) // If text is being logged regularly
        _.output.chanmsg(ircdata);

      // 5. Handle commands
      ircdata.args = ircdata.message.split(" ");
      if (ircdata.message.indexOf(_.config.prefix) === 0) {
        connection.handleCommands(ircdata);
      }
      // 6. Badwords
      if (_.config.badwords.enable) {
        var found = "";
        found = _.badwords.scan(ircdata);
        if(found) {
          _.badwords.announce(ircdata, found);
        }
      }
      // 7. CTCP
      if (ircdata.message.indexOf("\x01") === 0) {
        if (ircdata.message.substring(1).indexOf("VERSION") === 0) 
        {
          _.irc.notice(ircdata.sender, "\x01VERSION NodeIRCBot by boxmein (running on {0})\x01".format(_.os.hostname()));
        }
      }
    }
    // Ping-pong handling
    else if(data.indexOf("PING") != -1) {
      var pongtext = data.split(" ")[1] || ":00000000";
      _.irc.raw("PONG " + pongtext, true); // true disables it being logged
    }
    // Notices?
    else if(data.indexOf("NOTICE") != -1) { 
      var cutup = data.split(' ');   // Creates an array with 
      var resulte = cutup.splice(0,3);// ["hostmask", "command", "channel", "mess age"]
      resulte.push(resulte.join(" ").trim());
      var noticedata = {
        hostmask: resulte[0].substring(1),
        sender: resulte[0].substring(1, resulte[0].indexOf("!")),
        message: resulte[3].substring(1)
      };
      if (noticedata.hostmask.indexOf("freenode.net") == -1)
        _.output.inn("-"+noticedata.sender+"- :" +noticedata.message.trim());

      // NickServ identification when SASL fails
      if (noticedata.sender == "NickServ") {
        _.output.log("connection.onData", "NickServ sent me");
        if (noticedata.message.indexOf("identify") != -1) {
          _.output.log("connection.onData", "Identifying quick!");
          _.irc.privmsg("NickServ", "IDENTIFY " + _.config.pass, true);
        }
      }
    }
  },
  // If we get dumped
  onConnectionClose: function() {
    _.output.alert("irc.onConnectionClose", "Disconnected ()");
    _.irc.quit(undefined, true); 
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
          return typeof args[number] != 'undefined'? 
          args[number] : match;
    });
  };
}


var stdin = process.openStdin();

stdin.on('data', function(data) { 
  // feel free to add commands here. 
  data = data.toString().trim();
  if (data === '') 
    return;
  var args = data.split(" ");
  var cmd  = args.shift();
  // output.log("stdin.onData", "received input: " + data);
  if(cmd == "say") 
    _.irc.privmsg(args.shift(), args.join(" "));
  else if(cmd == "raw") 
    _.irc.raw(args.join(" "));
  else if(cmd == "join") 
    _.irc.join(args.shift());
  else if(cmd == "part") 
    _.irc.part(args.shift());
  else if(cmd == "quit")
    _.irc.quit(undefined, true);
  else if(cmd == "tlogging")
    _.config.textlogging = !_.config.textlogging;
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



console.log("Running on {0}. \nStarted on {1}"
    .format(_.os.hostname(), (new Date()).toUTCString()));
console.log("Working directory: " + process.cwd());


connection.client.setEncoding("ascii");
connection.client.setNoDelay();
connection.client.connect(connection.PORT, connection.HOST, connection.onConnected);

connection.client.on("data", connection.onData);
connection.client.on("close", connection.onConnectionClose);
connection.client.on("error", function(chunk) { 
  _.output.err("connection.client:onerror", "Socket error: " + chunk);
});