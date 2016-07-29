var express = require('express');
var router = express.Router();
var lib = require('../lib');
var debug = require('debug')('magnet-metadata-screenshots:router');

var cacheMock = {
  get: function() {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  },
  save: function (url, metadata) {
    return new Promise((resolve, reject) => {
      resolve(metadata);
    });
  }
}

var cache = cacheMock;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Magnet Metadata Screenshot' });
});

router.get('/view', function(req, res, next) {
  var url = req.query.url;
  if (!url) {
    var error = new Error('You need to include the url parameter');
    return res.render('error', error);
  }

  lib.getVisualInformation(url).
    then((metadata) => {
      return cache.save(url, metadata);
    })
    .then((metadata) => {
      res.render('view', metadata)
    })
    .catch((err) => {
      res.render('error', err);
    });
});

router.get('/info', function(req, res, next) {
  var url = req.query.url;
  debug(`Ready to get info about ${url}`);

  if (!url) {
    var error = new Error('You need to include the url parameter');
    return res.render('error', error);
  }

  cache.get(url).
    then((cached) => {
      if (cached) {
        res.json(cached);
        return;
      }

      lib.getVisualInformation(url).
        then((metadata) => {
          return cache.save(url, metadata);
        })
        .then((metadata) => {
          res.json(metadata);
        })
        .catch((err) => {
          res.render('error', err);
        });
    });
});

module.exports = router;
