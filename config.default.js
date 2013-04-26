// Log levels!
var l = {
  RAW_DATA: 1,        // Raw IRC      [<<]
  TEXT_LOGS: 2,       // Text logging [##] <nickname/#channel> text
  ALERTS: 4,          // Alerts       [!!]
  LOGS: 8,            // Logging      [LL]
  ERRORS: 16          // Errors       [EE]
};

var config = {
  // For prefix, see commands
  loglevel: l.ALERTS | l.LOGS | l.ERRORS, // Add together values from l. 
  loud:  false,  // Used by modular to output errors into the IRC
  prefix: "",    // The bot's command prefix character (if more than one there's a number you need change)
  enableSandboxJS: false, // Enables sandboxed JS interpreter 
  partmsg: "",   // Message to send when leaving channel
  quitmsg: "",   // Message to send when quitting
  nickname: "",  // Bot nickname
  pass: "",      // NickServ password
  realname: "",  // Reported real name
  channels: "",  // Channels separated by comma. Example: #chat,#freenode,#a,#b,#oneliners
  owner: "",      // Use a part of the hostmask
  server: "irc.freenode.net", // IRC server to connect to (irc.freenode.net)
  ownerEmail: "", // Owner of the bot, for user-agents in requests. 
  lastFM: {
    apiKey: "",   // Last.fm API key for commands.lastfm
    secretKey: "" // Last.fm secret key
  },
  badwords: { // Preparation for badwords.js
    enable:      false,
    shoutAbuse:  true,
    useOpPowers: false,
    words: [],
    abuse: []
  }
};
module.exports = config;

// Log levels!
var l = {
  RAW_DATA: 1,        // Raw IRC      [<<]
  TEXT_LOGS: 2,       // Text logging [##] <nickname/#channel> text
  ALERTS: 4,          // Alerts       [!!]
  LOGS: 8,            // Logging      [LL]
  ERRORS: 16          // Errors       [EE]
};