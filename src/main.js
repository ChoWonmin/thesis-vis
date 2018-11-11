const polar = new Polar(d3.select('#renderer'));

let target = data;

let yearMap = [];
for (let i=2000; i<2017; i++)
    yearMap.push(i);

const diffCircle = polar.height/42;
const padding = 10;

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
    e.angle = angle;
    e.color = colorMap[e.cluster];
});

const nodesGroupByYear = {};
for (let i=2000; i<2017; i++) {
  nodesGroupByYear[i] = _.filter(nodes, e => e.year === i);
}

function update() {

  // _.forEach(nodes, e=> {
  //   e.angle += 0.2;
  // });

  _.forEach(nodes, src => {
    _.forEach(nodesGroupByYear[src.year], dest => {
      const distance = Math.abs(src.angle - dest.angle);

      if (distance <= 0.5 && distance!==0) {
        console.log(distance)
        if (src.angle < dest.angle) {
          src.angle = src.angle - 0.01;
          dest.angle = dest.angle + 0.01;
        } else if (src.angle > dest.angle) {
          src.angle = src.angle + 0.01;
          dest.angle = dest.angle - 0.01;
        }
      }

    });
  });
}

function render() {
  _.forEach(nodes, e => {
    polar.drawNode(e.radius, e.angle, {color:e.color});
  });
}

function animate() {
  requestAnimationFrame( animate );

  polar.clear();

  update();

  render();

};

animate();
