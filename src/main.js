console.log(data);
const polar = new Polar(d3.select('#renderer'));

let target = data;

let yearMap = [];
for (let i=2000; i<2016; i++)
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

    e.radis = yearMap[e.year];
    e.angle = angle;
    e.color = colorMap[e.cluster];
});

console.log(nodes);

function animate() {
  requestAnimationFrame( animate );

  polar.clear();

  _.forEach(nodes, src => {
    _.forEach(nodes, dest => {
      const distance = Math.abs(src.angle - dest.angle);

      if (distance < 0.01) {
        if (src.angle < dest.angle) {
          src.anlge -= 1;
          dest.anlge += 1;
        } else if (src.angle < dest.angle) {
          src.anlge +=  0.1;
          dest.anlge -=  0.1;
        }

      }
    });

    polar.drawNode(src.radis, src.angle, {color:src.color});
  });
};

// animate();

_.forEach(nodes, src => {
  _.forEach(nodes, dest => {
    const distance = Math.abs(src.angle - dest.angle);

    if (distance < 0.05) {
      console.log('distance',distance);

      if (isNaN(src.anlge))
          console.log(src);

      if (src.angle < dest.angle) {
        src.anlge = src.angle - 0.1;
        dest.anlge = dest.anlge + 0.1;
      } else if (src.angle > dest.angle) {
        src.anlge = src.angle + 0.1;
        dest.anlge = dest.anlge - 0.1;
      }

    }
  });

  polar.drawNode(src.radis, src.angle, {color:src.color});
});

