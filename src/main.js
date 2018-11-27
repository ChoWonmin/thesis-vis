const polar = new Polar(d3.select('#renderer'));

let target = data;

let yearMap = [];
for (let i=1995; i<2017; i++)
  yearMap.push(i);

const diffCircle = polar.height/54;
const padding = 5;

yearMap = _.reduce(yearMap, (ac,e)=> {
  ac[e] = (e-1995+5)*diffCircle + padding;
  return ac;
},{});

polar.drawAxis();

_.forEach(yearMap,(e,i)=>{
  if(i%5===0)
    polar.drawCircle(e, '#333');
  else
    polar.drawCircle(e);
});

const colorMap = {
  0: '#ff704f',
  1: '#bee8ad',
  2: '#89c3ff',
  3: '#5041ff',
  4: '#ffbc73',
};

const nodes = _.forEach(target, e => {
  const diffAngle = 2*Math.PI/1;
  let angle = diffAngle * (Math.random() - 0.5);

  e.radius = yearMap[e.year];
  e.angle = normalizeAngle(angle);
  e.color = colorMap[0];
});

const nodesGroupByYear = {};
for (let i=1995; i<2017; i++) {
  nodesGroupByYear[i] = _.filter(nodes, e => e.year === i);
}

function normalizeAngle(angle) {
  if (angle < 0)
    return Math.PI * 2 + angle;
  else if (angle > 2 * Math.PI)
    return angle - 2 * Math.PI;
  return angle;
}

function collide(collision) {
  let isCollide = true;
  while(isCollide) {
    isCollide = false;

    _.forEach(nodes, src => {
      _.forEach(nodesGroupByYear[src.year], dest => {
        if (src._id === dest._id)
          return;

        let theta = Math.abs(src.angle - dest.angle);

        if ((2*Math.PI - theta)* yearMap[src.year] <= collision) {
          isCollide = true;
          if (src.angle <= dest.angle) {
            src.angle = normalizeAngle(src.angle + 0.01);
            dest.angle = normalizeAngle(dest.angle - 0.01);
          } else if (src.angle > dest.angle) {
            src.angle = normalizeAngle(src.angle - 0.01);
            dest.angle = normalizeAngle(dest.angle + 0.01);
          }
          return;
        }

        const length = theta * yearMap[src.year];

        if (length <= collision) {
          isCollide = true;
          if (src.angle <= dest.angle) {
            src.angle = normalizeAngle(src.angle - 0.01);
            dest.angle = normalizeAngle(dest.angle + 0.01);
          } else if (src.angle > dest.angle) {
            src.angle = normalizeAngle(src.angle + 0.01);
            dest.angle = normalizeAngle(dest.angle - 0.01);
          }
        }

      });
    });
  }

}

function render() {
  _.forEach(nodes, e => {
    polar.drawNode(e.radius, e.angle, {color:e.color})
      .on('mouseover', function () {
        _.forEach(e.references, parent => {
          polar.drawLine(e, nodes[parent], {color: '#ffbc73'});
        });

        _.forEach(e.offsprings, child => {
          polar.drawLine(e, nodes[child], {color: '#aaffff'});
        });
    }).on('mouseout', function () {
      polar.foregroundG.selectAll('*').remove();
    });

    _.forEach(e.references, parent => {
      polar.drawLine(e, nodes[parent]);
    });

  });
}

const roots_topDown = _.filter(nodes, e => e.references.length < 1);
const roots_bottomUp = _.filter(nodes, e => e.offsprings.length < 1);

function bfs() {
  const visit = {};
  const root = nodes[100]//roots[0];

  const queue = [];
  queue.push(root);
  visit[root._id] = true;

  while(queue.length > 0) {
    const node = queue.shift();

    for (let i=0; i<node.references.length; i++) {
      const dest = nodes[node.references[i]];

      if(!visit[dest._id]) {
        queue.push(nodes[dest._id]);
        visit[dest._id] = true;
      }
    }

    node.color = '#ffaaff';
  }
}

function genTreeByBottomUp(root) {
  const visit = {};

  const queue = [];
  queue.push(root);
  visit[root._id] = true;

  while(queue.length > 0) {
    const node = queue.shift();

    for (let i=0; i<node.references.length; i++) {
      const dest = nodes[node.references[i]];

      if (dest === undefined)
        continue;

      if(!visit[dest._id]) {
        queue.push(nodes[dest._id]);
        visit[dest._id] = true;
      }
    }

    node.angle = root.angle;

  }
}

function genTreeByTopDown(root) {
  const visit = {};

  const queue = [];
  queue.push(root);
  visit[root._id] = true;

  while(queue.length > 0) {
    const node = queue.shift();

    for (let i=0; i<node.offsprings.length; i++) {
      const dest = nodes[node.offsprings[i]];

      if (dest === undefined)
        continue;

      if(!visit[dest._id]) {
        queue.push(nodes[dest._id]);
        visit[dest._id] = true;
      }
    }

    node.angle = root.angle;

  }
}

collide(35);
// _.forEach(roots_topDown, e => { // root
//   e.color = '#5041ff';
//   genTreeByTopDown(e);
// });

_.forEach(roots_bottomUp, e => { // leaf
  e.color = '#5041ff';
  genTreeByBottomUp(e);
});

collide(35);
render();

console.log(roots.length);
console.log(roots_offspring.length);
console.log(target);
console.log(Object.keys(target).length);
