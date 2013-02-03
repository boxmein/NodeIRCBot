
var output = require("./output.js");
var crypto = {
  verify: function() { return true},
  otp: function(pad, message) {
    var newstr = "";
    if (pad.length >= message.length) {
      message = message.toUpperCase();
      pad = pad.toUpperCase();
      for (var i = 0; i < message.length; i++) {
        newstr += String.fromCharCode(  ( (message.charCodeAt(i) - 65) + (pad.charCodeAt(i) - 65) ) % 26 + 65 );
      }
      output.log("crypto.otp", "OTP: " + newstr);
      output.log("crypto.otp", "Pad: " + pad);
      return newstr;
    }
    else 
      output.err("crypto.otp", "Pad is shorter than the message");
  },
  caesar: function(offset, message) {
    message = message.toUpperCase();
    var newstr = ""; 
    try {
      offset = parseInt(offset);
    }
    catch (error) {
      output.err("crypto.caesar", "couldn't parse integer: " + offset);
      output.log("crypto.caesar", "error: " + error);
      offset = 5
    }
    for (var i = 0; i < message.length; i++) {
      newstr += String.fromCharCode((message.charCodeAt(i) - 65 + offset) % 26 + 65);
    }
    output.log("crypto.caesar", "Shift complete: " + newstr);
    return newstr;
  },
  rot13: function(notused, message) {
    return crypto.caesar(13, message);
  }
};
module.exports = crypto;