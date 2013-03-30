var _ = {};

module.exports = {
	helptext: "lastfm <username> - Gets the latest song played by LastFM user", 
	enable: 0,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) { 
		_ = underscore; 
		console.log("Initialised lastfm.js");
	},
	exec: function(ircdata) {
		var endstr = "";
    var username = ircdata.args[0] || false;
    if (!username) 
    	throw "No username specified"; 
    var req = _.http.request( 
      {
        hostname: "ws.audioscrobbler.com",
        path: "/2.0/?method=user.getRecentTracks&limit=2&api_key="+ _.config.lastFM.apiKey+"&user="+username,
        method: "GET",
        headers: {
          "User-Agent": "boxnode IRC Bot (@ "+ _.config.server+", contact " + _.config.ownerEmail + ")",
          "X-Powered-By": "Node.js v0.8.16"
        }
      }, function(response) {
        if (response.statusCode == 200)
        { 
          var data = "";
          response.setEncoding("utf8");
          response.on("data", function(chunk) {
          	data += chunk;
          });
        }
        else throw "HTTP response wasn't OK: " + response.statusCode; 
    });
    req.on("error", function(evt) { throw "Request error: " + evt.message; });
    req.on("end", function(evt) { 
      _.output.log("commands:lastfm", "Last.fm ready for parsing data.");
      var xmlobj = {};
      var xmlparse = new _.DOMParser();
      try {
      xmlobj = xmlparse.parseFromString(chunk);
      if (xmlobj.getElementsByTagName("lfm")[0].getAttribute("status") != "ok")
        throw "Last.fm returned bad status code: " + xmlobj.getElementsByTagName("lfm")[0].status;
      var track = xmlobj.getElementsByTagName("track")[0];
      endstr += (track.nowplaying == "true" ? "Now Playing: " : "Last Played: ");
      endstr += track.getElementsByTagName("artist")[0].textContent + " - ";
      endstr += track.getElementsByTagName("name")[0].textContent; 
      _.commands.respond(ircdata, endstr);
      } catch(err) { throw "Error parsing XML: " + err; }

    });
    req.end();
	}
}