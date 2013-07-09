var redis = require('redis')
  , client
  , space = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  , slength = space.length;

var base62  = exports.base62 = function(callback) {
  client.incr('sequence', function(err, reply) {
    if (err) {
      callback(err, null);
    } else {
      var result = '';
      var seq = reply;
      do {
        result = space[seq% slength] + result;
        seq = Math.floor(seq / slength);
      } while(seq > 0)
      callback(null, result);
    }
  });
};

var connect = exports.connect = function(port, host, options) {
  client = exports.client = redis.createClient(port, host);
  
  client.on("error", function (err) {
    console.log("Reis Connect Error - " + client.host + ":" + client.port + " - " + err);
  });

  client.on("connect", function () {
    console.log("Reis Connect Successfully - " + client.host + ":" + client.port);
  });

  client.on("end", function () {
    console.log("Reis Connect End - " + client.host + ":" + client.port);
  });
};

var generate = exports.generate = function(URL, callback) {
  base62(function(err, base62Url) {
    if (err) {
      callback(err, null);
    } else {
      client.set(base62Url, URL, function(err2, reply) {
        if (err2) {
          callback(err2, null);
        } else {
          callback(null, base62Url);
        }
      });
    }
  });
};

var retrieve = exports.retrieve = function(base62Url, callback) {
  client.get(base62Url, function(err, reply) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, reply);
    }
  });
};
