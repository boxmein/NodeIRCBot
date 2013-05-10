/*jshint node: true*/

var _ = {}; // Contains all the references to our objects
var commands = {
  cmds: {},  // Command objects are kept in here
  helps: {}, // Helptexts are added in .load(cmd, file);
  // Gives me module references to use
  init: function(underscore) {
    _ = underscore;
    try { 
      this.load("hello", "./modules/hello.js"); // Hello world
      this.load("eat",   "./modules/eat.js");   // Feasting upon users
      this.load("list",  "./modules/list.js");  // Listing commands
      this.load("owner", "./modules/owner.js"); // Owner commands
      this.load("help",  "./modules/help.js");  // Help texts
      this.load("bug",   "./modules/bug.js");   // Bug handling (fake)
      this.load("js",    "./modules/inline-js.js"); // Javascript
      this.load("lastfm","./modules/lastfm.js");// Last.fm Now Playing
      this.load("quote", "./modules/quotes.js");// Quotes
      this.load("admin", "./modules/admin.js"); // Admin commands (weaker than owner)
      this.load("down",  "./modules/http-isdown.js"); // Checking if a site is down
      this.load("stm",   "./modules/sendtoxsbot.js"); // Send texts to xsbot (broken)
      this.load("gam",   "./modules/gamble.js"); // Gamble for fake money
      this.load("proc",  "./modules/stdstream.js"); // Spawn new process for commands
      // Load commands before this next line
      this.cmds.list.setList(this.generateCmdList()); // Give cmds the list
      this.cmds.help.setHelp(this.helps);// Give help the object that lists all helpings
      console.log("This worked!"); 

    }
    catch (err) {
      _.output.err("commands.init", "Couldn't load all commands: " + err);
    }
  },
  exec: function(ircdata) {
    if (!this.cmds.hasOwnProperty(ircdata.command)) 
      throw "Command not found: " + ircdata.command;
    else if (!this.cmds[ircdata.command].enable)
      throw "Command is disabled: " + ircdata.command;
    else {
      this.cmds[ircdata.command].exec(ircdata);
    }
  },
  load: function(cmd, file) {

    if (!/\.js$/.test(file))
      throw "File name invalid: "+ file;
    try {
      this.cmds[cmd] = require(file);
      // Set the filename - use for reloading. 
      this.cmds[cmd].file = file;
      if(this.cmds[cmd].init(_))
        throw "Init failed for command " + cmd;
      this.helps[cmd] = this.cmds[cmd].getHelp();
    }
    catch (err) {
      throw "Error loading file "+ file + " : " + err;
    }
  },
  // reload can't possibly work because require cache
  /*reload: function(cmd) {
    delete require.cache[this.cmds[cmd].file];
    this.load(cmd, this.cmds[cmd].file);
  },*/
  generateCmdList: function() {
    var commandlist = "";
    for (var cmd in this.cmds) {
      if (cmd == "owner" || cmd == "admin" || cmd == "gam")
        cmd += "...";
      commandlist += cmd + ", ";
    }
    // remove trailing comma+space
    commandlist = commandlist.substring(0, commandlist.length-2);
    return commandlist;
  },
  respond: function(ircdata, reply, nonick) {
    _.irc.privmsg(ircdata.channel, (nonick ? "" : ircdata.sender + ": ")  + reply);
  },
  sender_isowner: function(hostmask) {
    return hostmask.search(_.config.owner) != -1;
  },
  cleanup_query: function(query) {
    if (query && typeof query == "string") 
      return query.trim().replace(/[^A-Za-z]+?/gi, ""); 
    else
      this.cleanup_query(""+query);
  },
  reload: function(modulename) { 
    _.output.log("Attempting to reload : " + modulename); 
    var filename = _.commands.cmds[modulename].file; 
    _.output.log("...with filename: " + filename);
    _.commands.cmds[modulename] = null;
    _.commands.cmds[modulename] = require(filename); 
  },
  // Called before unloading from stdin commands.
  die: function() {
    for (var k in _.commands.cmds)
    {
      if (die in _.commands.cmds[k])
        _.commands.cmds[k].die();
    }
  }
};
module.exports = commands;

// Log levels!
var l = {
  ALL_OUTPUT: 0,
  NO_RAWS: 1, 
  NO_TEXT: 2,
  NO_LOGGING: 3, 
  NO_ALERTS: 4, 
  NO_ERRORS: 5
};