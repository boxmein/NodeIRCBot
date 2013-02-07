// Warning! Any requires to bot core modules must have ../ instead of ./!
var output = require("../output.js");
var crypto = {
  // Have a verify function ready, it'll be called beforehand, initialize everything etcetera.
  verify: function() { return true },
  // THis doesn't work.
  otp: function(pad, message, reverse) {
    var newstr = "", currentchar;
    if (pad.length >= message.length) {
      message = message.toUpperCase();
      pad = pad.toUpperCase();
      if (!reverse) {
        
        for (var i = 0; i < message.length; i++) {
          newstr += String.fromCharCode(  ( (message.charCodeAt(i) - 65) + (pad.charCodeAt(i) - 65) ) % 26 + 65 );
        }
        output.log("crypto.otp", "OTP: " + newstr);
        output.log("crypto.otp", "Pad: " + pad);
        return newstr;
      }
      else {
        message = message.toUpperCase();
        for (var i = 0; i < message.length; i++) {
          currentchar = message.charCodeAt(i) - 65; // Offset so they work together
          currentchar -= pad.charCodeAt(i) - 65; // Get rid of the pad
          if (currentchar < 0) 
            currentchar = -currentchar;
          currentchar += 65;
          newstr += currentchar;
        }
        output.log("crypto.otp", "Decrypted: " + message);
        output.log("crypto.otp", "Pad: " + pad);
        return newstr;
      }
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
  rot13: function(message) {
    return crypto.caesar(13, message);
  }
};
module.exports = crypto;