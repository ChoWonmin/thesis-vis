const fs = require('fs');
const _ = require('lodash');

const source = './papers_sigraph.json';
const dest = '../data/out.json';

const data = JSON.parse(fs.readFileSync(source, 'utf8'));

const out = {};
_.forEach(data, e => out[e._id] = e);

fs.writeFileSync(dest, JSON.stringify(out));
