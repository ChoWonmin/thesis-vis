const fs = require('fs');
const _ = require('lodash');

const source = './papers_sigraph.json';
const dest = '../data/out.json';

const data = JSON.parse(fs.readFileSync(source, 'utf8'));

const out = {};
_.forEach(_.filter(data, e=> e.year >= 1995), e => out[e._id] = e);

_.forEach(data, e => {
  e.offspring = [];
});

_.forEach(out, e => {
  let tmp = [];

  for (let i=0; i< e.references.length; i++) {
    const referenceId = e.references[i];

    if (out[referenceId]!==undefined) {
      tmp.push(referenceId);
      out[referenceId].offspring.push(e._id);
    }
  }
  e.references = tmp;
});

fs.writeFileSync(dest, JSON.stringify(out));
