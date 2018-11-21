const polar = new Polar(d3.select('#renderer'));

const tmp = _.filter(data, e => e.offspring.length > 25);

let target = {};

_.forEach(tmp, e => target[e._id]=e);

console.log(target);

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
        _.forEach(e.references, j => {
            const reference = nodes[j];

            if (e.cluster === reference.cluster)
              polar.drawLine(e, reference);
        });
    }).on('mouseout', function () {
      polar.foregroundG.selectAll('*').remove();
    });

    // _.forEach(e.references, j => {
    //   const reference = nodes[j];
    //
    //   if (e.cluster === reference.cluster && e.year <= reference.year+3)
    //     polar.drawLine(e, reference);
    // });

  });
}

const roots = _.filter(nodes, e => e.references.length < 1);

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

function drawTree(root) {
  const visit = {};

  const queue = [];
  queue.push(root);
  visit[root._id] = true;

  while(queue.length > 0) {
    const node = queue.shift();

    for (let i=0; i<node.references.length; i++) {
      const dest = nodes[node.references[i]];

      if(!visit[dest._id] && dest.cluster === root.cluster) {
        queue.push(nodes[dest._id]);
        visit[dest._id] = true;
      }
    }

    node.angle = root.angle;

  }
}


// function animate() {
//   requestAnimationFrame( animate );
//
//   polar.clear();
//
//   collide(15);
//
//   render();
// };

collide(10);
// _.filter(nodes, e=> e.year>2010).forEach(e => { // leaf
//   drawTree(e);
// });
//
// collide(25);
render();

// animate();

console.log(nodes['1aebaeae-db84-4727-b93b-511d08df43b9']);

