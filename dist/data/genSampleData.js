'use strict';

var fs = require('fs');
var _ = require('lodash');

var data = {};

for (var i = 0; i < 350; i++) {
  data[i] = {
    id: i,
    year: 2000,
    references: [],
    cluster: parseInt(Math.random() * 5)
  };
}

for (var _i = 5; _i < 400; _i++) {
  if (_i < 10) data[_i]['year'] = 2001;else if (_i < 15) data[_i]['year'] = 2002;else if (_i < 22) data[_i]['year'] = 2003;else if (_i < 30) data[_i]['year'] = 2004;else if (_i < 40) data[_i]['year'] = 2005;else if (_i < 50) data[_i]['year'] = 2006;else if (_i < 70) data[_i]['year'] = 2007;else if (_i < 95) data[_i]['year'] = 2008;else if (_i < 110) data[_i]['year'] = 2009;else if (_i < 130) data[_i]['year'] = 2010;else if (_i < 155) data[_i]['year'] = 2011;else if (_i < 190) data[_i]['year'] = 2012;else if (_i < 235) data[_i]['year'] = 2013;else if (_i < 280) data[_i]['year'] = 2014;else if (_i < 310) data[_i]['year'] = 2015;else if (_i < 350) data[_i]['year'] = 2016;
}

_.forEach(data, function (e, i) {
  var len = parseInt(i / 15) + 1;

  var _loop = function _loop(j) {
    var value = i - parseInt(Math.random() * i);

    var isValid = !_.find(e['references'], function (e) {
      return e === value;
    }) && i != value && e.year > data[value].year;

    if (isValid) {
      e['references'].push(value);
    }
  };

  for (var j = 0; j < len; j++) {
    _loop(j);
  }
});

fs.writeFile('./data.js', 'const data = ', function (err) {
  if (err) throw err;
  console.log('Saved!');
});

fs.appendFile('./data.js', JSON.stringify(data), function (err) {
  if (err) throw err;
  console.log('Saved!');
});