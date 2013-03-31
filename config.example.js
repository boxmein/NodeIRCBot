// Example configuration file
// Note, don't ever broadcast this, as it contains your NickServ password
// and Last.fm secret API keys!
// Some parts may not be used right now.
var config = {
  // For prefix, see commands
  silent: false, // Hides log and channel messages, leaves errors
  loud: true,  // Says error messages out
  badwords: true, // Uses the badwords plugin
  prefix: "#",
  textlogging: true, // Does the <nick/channel> logging thing
  rawlogging: false, // Logs everything
  nickname: "boxnode",
  pass: "doyoubelieveinmagic",
  realname: "magikku",
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