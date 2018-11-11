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

console.log(nodesGroupByYear);

function normalizeAngle(angle) {
  if (angle < 0)
    return Math.PI * 2 + angle;
  else if (angle > 2 * Math.PI)
    return angle - 2 * Math.PI;
  return angle;
}

function update() {

  _.forEach(nodes, src => {
    _.forEach(nodesGroupByYear[src.year], dest => {
      const distance = Math.abs(src.angle - dest.angle);

      if (distance <= 0.3 && distance!==0) {
        if (src.angle <= dest.angle) {
          dest.angle = normalizeAngle(dest.angle + 0.01);
        } else if (src.angle > dest.angle) {
          dest.angle = normalizeAngle(dest.angle - 0.01);
        }
      }

    });
  });
}

function render() {
  _.forEach(nodes, e => {
    // if (e.angle > Math.PI *2) console.log(e.angle);
    polar.drawNode(e.radius, e.angle, {color:e.color});
  });
}

function animate() {
  requestAnimationFrame( animate );

  polar.clear();

  update();

  render();

};

// animate();
// render();

console.log(nodesGroupByYear);
