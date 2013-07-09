var  express = require('express'),
  short = require('./lib/short'),
  app = express(),
  port = process.env.PORT || 8080;

short.connect(6379, 'localhost');

app.get('/generate', function(req, res) {
  var source = req.query.source;
  if (!source) {
    return;
  }

  short.generate(source, function(err, base62Url) {
    if (err) {
      console.error(err);
    } else {
      res.end(base62Url);
    }
  });
});

app.get('/query', function(req, res) {
  var base62Url = req.query.short;
  if (!base62Url) {
    return;
  }
  
  short.retrieve(base62Url, function(err, URL) {
    if (err) {
      console.error(err);
    } else {
      if (URL) {
        res.end(URL);
      } else {
        res.send('not found!', 404);
        res.end();
      }
    }
  });
});

app.get('/goto', function (req, res) {
  var base62Url = req.query.short;
  if (!base62Url) {
    return;
  }

  short.retrieve(base62Url, function (err, URL) {
    if (err) {
      console.error(err);
    } else {
      if (URL) {
        res.redirect(URL, 302);
      } else {
        res.send('URL not found!', 404);
        res.end();
      }
    }
  });
});

app.listen(port, function () {
  console.log('Server running on port ' + port);
});
