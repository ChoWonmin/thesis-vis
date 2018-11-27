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

// _.forEach(data, e => {
//   e.offspring = [];
// });
//
// _.forEach(out, e => {
//   let tmp = [];
//
//   for (let i=0; i< e.references.length; i++) {
//     const referenceId = e.references[i];
//
//     if (out[referenceId]!==undefined) {
//       tmp.push(referenceId);
//       out[referenceId].offspring.push(e._id);
//     }
//   }
//   e.references = tmp;
// });

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
fs.writeFileSync(dest, JSON.stringify(out));
