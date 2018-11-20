var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  //const data = JSON.parse(fs.readFileSync('./papers_sigraph.json', 'utf8'));
  console.log(process.cwd());
  res.render('index', { data2: 'hello'});
});

module.exports = router;
