'use strict';

var fs = require('fs');
var _ = require('lodash');

var source = './db.json';
var dest = '../data/out.json';

var data = JSON.parse(fs.readFileSync(source, 'utf8'));

function convert_hash(data, year) {
  var out = {};
  _.forEach(_.filter(data, function (e) {
    return e.year >= year;
  }), function (e) {
    return out[e._id] = e;
  });

  return out;
}

function delete_reference(data) {
  _.forEach(data, function (e) {
    var tmp = [];

    _.forEach(e.references, function (reference) {

      if (data[reference] !== undefined) tmp.push(reference);
    });

    e.references = tmp;
  });
}

function generate_offsprings(data) {
  _.forEach(data, function (e) {
    e.offsprings = [];
  });

  _.forEach(data, function (e) {
    _.forEach(e.references, function (reference) {

      if (data[reference] !== undefined) data[reference].offsprings.push(e._id);
    });
  });
}

function filter_reference(data) {
  _.forEach(data, function (e) {});
}

function filtering(data) {
  var out = {};
  _.forEach(_.filter(data, function (e) {
    return e.offspring.length > 30;
  }), function (e) {
    return out[e._id] = e;
  });

  return out;
}

var out = convert_hash(data, 1995);
delete_reference(out);
generate_offsprings(out);

fs.writeFileSync(dest, JSON.stringify(out));