console.log(data);
const polar = new Polar(d3.select('#renderer'));

let target = _.filter(data, e=> e.year>=2000);

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

}

_.forEach(target, e=>{
    polar.drawNode(yearMap[e.year], Math.random()*360, {color:colorMap[parseInt(Math.random()*4)]});
});
