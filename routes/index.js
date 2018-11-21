var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  const data = JSON.parse(fs.readFileSync('data/papers_sigraph.json', 'utf8'));
  res.render('index');
});

module.exports = router;
