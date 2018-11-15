const fs = require('fs');
const _ = require('lodash');

const data = {};

for (let i=0; i<350; i++) {
  data[i] = {
    id: i,
    year: 2000,
    references: [],
    cluster: parseInt(Math.random()*5)
  };
}

for (let i=5; i<400; i++) {
  if (i<10)
    data[i]['year'] = 2001;
  else if (i<15)
    data[i]['year'] = 2002;
  else if (i<22)
    data[i]['year'] = 2003;
  else if (i<30)
    data[i]['year'] = 2004;
  else if (i<40)
    data[i]['year'] = 2005;
  else if (i<50)
    data[i]['year'] = 2006;
  else if (i<70)
    data[i]['year'] = 2007;
  else if (i<95)
    data[i]['year'] = 2008;
  else if (i<110)
    data[i]['year'] = 2009;
  else if (i<130)
    data[i]['year'] = 2010;
  else if (i<155)
    data[i]['year'] = 2011;
  else if (i<190)
    data[i]['year'] = 2012;
  else if (i<235)
    data[i]['year'] = 2013;
  else if (i<280)
    data[i]['year'] = 2014;
  else if (i<310)
    data[i]['year'] = 2015;
  else if (i<350)
    data[i]['year'] = 2016;
}

_.forEach(data, (e, i) => {
  const len = parseInt(i/15)+1;
  for (let j=0; j<len; j++) {
    let value = i - parseInt(Math.random()*i);

    let isValid = (!_.find(e['references'], e => e===value)) && i!=value && e.year > data[value].year;

    if (isValid) {
      e['references'].push(value);
    }
  }
});

fs.writeFile('./data.js', 'const data = ', function (err) {
  if (err) throw err;
  console.log('Saved!');
});

fs.appendFile('./data.js', JSON.stringify(data), function (err) {
  if (err) throw err;
  console.log('Saved!');
});
