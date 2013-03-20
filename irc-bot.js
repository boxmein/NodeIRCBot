// When everything falls apart
// Just don't back down
// Just keep running
// Just look ahead
// You might be losing but you're not dead

// IRC bot core


// [ Module requirements]

var _ = {
  // Essentials
  net : require("net"),
  http : require("http"),
  sys : require("sys"),
  // Modules
  config   : require("./config.js"),   // Configuration
  commands : require("./commands.js"), // Channel commands
  output   : require("./output.js"),   // Output formatting
  irc      : require("./irc.js"),      // IRC wrappers
  // Command specialties
  Sandbox  : require("sandbox"),       // Javascript sandbox
  DOMParser: require("xmldom").DOMParser // XML DOM traversal
}

// [/Module requirements]


console.log("-------------------------------");
console.log("Boxmein's node IRC bot started.");
console.log("-------------------------------");

var connection = {
  client: new _.net.Socket(),
  PORT: 6667,
  HOST: _.config.server,
  onConnected: function() { // we are connected!
    
      _.output.init(_); // output > everything
      _.commands.init(_);
      _.irc.init(_);
    _.irc.setClient(connection.client);

    _.output.log("irc.onConnected", "Connection successful");
    _.output.announce("Press q + enter to exit program.");

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
    catch (err) 
    { _.output.err("command:" + ircdata.command, err); }
  },
  onData: function(data) {
    if(_.output.rawlogging)
        _.output.log("",data); // output raw IRC

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
      if (_.output.textlogging) // If text is being logged regularly
        _.output.chanmsg(ircdata);

      // 5. Handle commands
      ircdata.args = ircdata.message.split(" ");
      if (ircdata.message.indexOf(_.commands.prefix) == 0) {
        connection.handleCommands(ircdata);
      }
    }
    // Ping-pong handling
    else if(data.indexOf("PING") != -1) {
      _.irc.raw("PONG", true); // true disables it being logged
    }
    // Notices?
    else if(data.indexOf("NOTICE") != -1) { 
      var arr = data.split(' ');   // Creates an array with 
      var result = arr.splice(0,3);// ["hostmask", "command", "channel", "mess age"]
      result.push(arr.join(" ").trim());
      var noticedata = {
        hostmask: result[0].substring(1),
        sender: result[0].substring(1, result[0].indexOf("!")),
        message: result[3].substring(1),

      }
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
    _.output.log("irc.onConnectionClose", "Disconnected ()");
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
    _.irc.privmsg(args.shift(), args.join(" "));
  else if(cmd == "raw") 
    _.irc.raw(args.join(" "));
  else if(cmd == "join") 
    _.irc.join(args.shift());
  else if(cmd == "part") 
    _.irc.part(args.shift());
  else if(cmd == "quit")
    _.irc.quit();
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