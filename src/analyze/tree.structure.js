const fs = require('fs');
const _ = require('lodash');

const source = './papers_sigraph.json';

const data = JSON.parse(fs.readFileSync(source, 'utf8'));

// console.log(_.countBy(data, e => e.year));

const searchword = 'Painting';

const find = _.filter(data, e => e.title.search(searchword) >= 0);

_.forEach(find, e => {
  console.log(e.title, e.year, '=============');
  console.log( bfs(e) );
});


function bfs(root) {
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

