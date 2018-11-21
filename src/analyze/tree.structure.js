const fs = require('fs');
const _ = require('lodash');

const source = '../data/out.json';
// const source = './papers_sigraph.json';

const data = JSON.parse(fs.readFileSync(source, 'utf8'));

// console.log(_.countBy(data, e => e.year));
// console.log(_.countBy(data, e => e.references.length));
// console.log(_.countBy(data, e => e.offspring.length));
// console.log(_.countBy(data, e => e.citationCount));

// _.forEach(data, e=> {
//   // if (e.references.length>0 && e.offspring.length>0) {
//   //   cnt++;
//   //   console.log(e);
//   //   console.log('=====================================');
//   // }
//
//   if (e.references.length >= 50) {
//     console.log(e);
//     console.log('=====================================');
//   }
//
// });

// const searchword = 'Painting';
// const find = _.filter(data, e => e.title.search(searchword) >= 0);
const find = _.filter(data, e => e.offspring.length > 25);

function find_parents_bfs(root) {
  const tree = [];
  const visit = {};

  const queue = [];
  queue.push(root);
  visit[root._id] = true;

  while(queue.length > 0) {
    const node = queue.shift();
    tree.push(node);

    for (let i=0; i<node.references.length; i++) {
      const dest = data[node.references[i]];

      if (dest===undefined)
        continue;

      if(!visit[dest._id]) {
        queue.push(data[dest._id]);
        visit[dest._id] = true;
      }
    }
  }

  return tree;
}
function find_offspring_bfs(root) {
  const tree = [];
  const visit = {};

  const queue = [];
  queue.push(root);
  visit[root._id] = true;

  while(queue.length > 0) {
    const node = queue.shift();
    tree.push(node);

    for (let i=0; i<node.offspring.length; i++) {
      const dest = data[node.offspring[i]];

      if (dest===undefined)
        continue;

      if(!visit[dest._id]) {
        queue.push(data[dest._id]);
        visit[dest._id] = true;
      }
    }
  }

  return tree;
}

let sum = 0;
//
// _.forEach(data, e => {
//   // const p = find_parents_bfs(e);
//   // const c = find_offspring_bfs(e);
//
//   // console.log(e.title, e.references.length, e.offspring.length);
//
//   sum += e.offspring.length;
//
//   // console.log(e.references.length, e.offspring.length);
// });

console.log(find.length);
