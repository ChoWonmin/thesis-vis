var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/sandglass', function(req, res, next) {
  res.render('sandglass');
});

router.get('http://dblp.ourguide.xyz/papers/search?q={검색어}', function(req, res, next) {
  res.render('sandglass');
});

module.exports = router;
