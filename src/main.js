const polar = new Polar(d3.select('#renderer'));

let target = data;

let yearMap = [];
for (let i=2000; i<2017; i++)
  yearMap.push(i);

const diffCircle = polar.height/44;
const padding = 5;

yearMap = _.reduce(yearMap, (ac,e)=> {
  ac[e] = (e-2000+5)*diffCircle + padding;
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
  const diffAngle = 2*Math.PI/5;
  let angle = diffAngle * e.cluster + diffAngle * (Math.random() - 0.5);

  e.radius = yearMap[e.year];
  e.angle = normalizeAngle(angle);
  e.color = colorMap[e.cluster];
});

const nodesGroupByYear = {};
for (let i=2000; i<2017; i++) {
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
  _.forEach(nodes, src => {
    _.forEach(nodesGroupByYear[src.year], dest => {
      if (src.id === dest.id)
        return;

      let theta = Math.abs(src.angle - dest.angle);

      if ((2*Math.PI - theta)* yearMap[src.year] <= collision) {
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

let cnt = 0;

function render() {
  _.forEach(nodes, e => {
    polar.drawNode(e.radius, e.angle, {color:e.color});

    _.forEach(e.references, j => {
      const reference = nodes[j];

      if (e.year === reference.year+2 && e.cluster === reference.cluster) {
        cnt++;
        polar.drawLine(e, reference);
      }
    })
  });
}

function animate() {
  requestAnimationFrame( animate );

  polar.clear();

  collide(15);

  render();

};

// render();

animate();

console.log(nodes);
console.log(cnt);
