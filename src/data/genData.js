const fs = require('fs');

const file = './dblp-ref-3.json';

fs.readFile(file, function (err, data) {
  const str = data.toString('utf8');
  let copy = new Array(str.length + 1000);

  for (let i=0; i<str.length; i++) {
    copy[i] = str[i];
    if (str[i++]==='}')
      copy[i] = ',';
  }

  fs.writeFile('./out.json', copy, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
});
