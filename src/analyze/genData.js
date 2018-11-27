const fs = require('fs');
const _ = require('lodash');

const source = './db.json';
const dest = '../data/out.json';

const data = JSON.parse(fs.readFileSync(source, 'utf8'));

function convert_hash (data, year) {
  const out = {};
  _.forEach(_.filter(data, e=> e.year >= year), e => out[e._id] = e);

  return out;
}

function delete_reference(data) {
  _.forEach(data, e => {
    const tmp = [];

    _.forEach(e.references, reference => {

      if (data[reference] !== undefined)
        tmp.push(reference);
    });

    e.references = tmp;
  });
}

function generate_offsprings(data) {
  _.forEach(data, e => {
    e.offsprings = [];
  });

  _.forEach(data, e => {
    _.forEach(e.references, reference => {

      if (data[reference] !== undefined)
        data[reference].offsprings.push(e._id);
    });
  });
}

function filter_reference(data) {
  _.forEach(data, e => {

  });
}

function filtering(data) {
  const out = {};
  _.forEach(_.filter(data, e=> e.offspring.length > 30), e => out[e._id] = e);

  return out;
}

const out = convert_hash(data, 1995);
delete_reference(out);
generate_offsprings(out);

fs.writeFileSync(dest, JSON.stringify(out));
