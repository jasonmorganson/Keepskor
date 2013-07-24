var http = require('http');

var OK = null;  // Signals no error in a successful callback

function Keepskor() {

    this.key = 'key';
    this.token = 'token';
    this.hasStarted = false;
    this.isCached = false;
}

Keepskor.prototype.getPlayerKey = function(callback) {

    var self = this;

    self.getSelf(function(error, self) {
        if (error) throw error;
        callback(OK, self.key);
    });
};

Keepskor.prototype.getPlayerToken = function(callback) {

    var self = this;

    self.getSelf(function(error, self) {
        if (error) throw error;
        callback(OK, self.token);
    });
};

Keepskor.prototype.getSelf = function(callback) {

    var self = this;

    if (self.isCached) {
       callback(OK, self);

    } else if (!self.hasStarted) {
        self.hasStarted = true;
        fetchResults(function(error, results) {
            if (error) callback(error);
            self.key = results.key;
            self.token = results.token;
            self.isCached = true;
            callback(OK, self);
        });

    } else {
        setImmediate(function() {
            self.getSelf(callback);
        });
    }
};

var fetchResults = function(callback) {

    var options = {
        host: 'pong.keepskor.com',
        path: '/api/player',
        method: 'POST',
        headers: {
            "Cookie": "ks_a"
        }
    };

    var request = http.request(options, function(response) {

        response.setEncoding('utf-8');

        response.on('readable', function(){
            callback(OK, {
                key: response.read()
                /* token: parseToken(response) */
            });
        });
    });

    request.on('error', function(error) {
        callback( new Error("Error", error) );
    });

    request.end();
};

var parseToken = function(response) {

    var headers = response.headers || {};
    var cookies = headers['set-cookie'] || {};
    var token = cookies['ks_a'] || null;

    console.log("HEADERS:");
    console.log(headers);
    console.log("COOKIES:");
    console.log(cookies);
    console.log("TOKEN!!!: " + token);

    return token;
};

module.exports = new Keepskor();
