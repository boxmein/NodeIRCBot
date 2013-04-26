// Log levels!
var l = {
  RAW_DATA: 1,        // Raw IRC      [<<]
  TEXT_LOGS: 2,       // Text logging [##] <nickname/#channel> text
  ALERTS: 4,          // Alerts       [!!]
  LOGS: 8,            // Logging      [LL]
  ERRORS: 16          // Errors       [EE]
};

// Example configuration file
// Note, don't ever broadcast this, as it contains your NickServ password
// and Last.fm secret API keys!
// Some parts may not be used right now.
var config = {
  // For prefix, see commands
  loglevel: l.ALERTS | l.LOGS | l.ERRORS, // Add together values from l. 
  loud: true,  // Says error messages out
  prefix: "!",
  enableSandboxJS: false,
  nickname: "NameUnchanged",
  pass: "doyoubelieveinmagic",
  realname: "boxmein/NodeIRCBot",
  server: "irc.freenode.net",
  //server: "localhost",
  channels: "##boxmein,##powder-bots",
  owner: "unaffiliated/boxmein",// Use a part of the hostmask
  ownerEmail: "inayounggirlsheart@gmail.com", 
  lastFM: {
    apiKey: "or4twjeogrjrowr3qaijhrro3qwoaifsdgj", // Not a real key 
    secretKey: "shhhhhthisisasecretkey"
  },
  badwords: { // Preparation for badwords.js
    enable:      false,
    shoutAbuse:  true,
    useOpPowers: false,
    words: ["alpha", "beta", "gamma", "delta"],
    abuse: ["yay"]
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