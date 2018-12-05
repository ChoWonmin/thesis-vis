console.log(hull(
  [[1,1], [2,4], [8,1], [2,1], [1,9], [1,3]]
));

console.log(hull(
  [{x: 1, y: 1}, {x: 2, y: 4}, {x: 8, y: 1}, {x: 2, y: 1}, {x: 1, y: 9}, {x: 3, y: 3}], 100, ['.x', '.y']
));

const sandglass = (async function() {

  const searchBar = document.getElementById('search-input');
  const searchList = document.getElementById('search-list');
  const searchItem = (title, authors) => `<div class="item">
      <div class="title">${title}</div>
      <div class="author">${authors}</div>
  </div>`;

  const colorMap = {
    0: '#ff704f',
    1: '#bee8ad',
    2: '#89c3ff',
    3: '#5041ff',
    4: '#ffbc73',
  };

  const parent = new Plane(d3.select('#parent'));
  const child = new Plane(d3.select('#child'));

  this.drawAxis = function () {
    const startYear = 2000;
    const lastYear = 2018;
    const padding = 30;
    const num = lastYear - startYear;
    const diff = (parent.height- 2*padding) / (num-1);
    const res = {};

    for (let i=0; i< num; i++) {
      const y = diff * i + padding;
      res[startYear + i] = y;
      //parent.drawAxisX(y, startYear+i);
      parent.drawAxisX(y);
      child.drawAxisX(y);
    }

    child.drawAxisX(50);

    return res;

  };
  const nodesGroupByYear = this.drawAxis();

  let list = data; //(await axios.get('http://dblp.ourguide.xyz/papers/search')).data;

  this.addSearchEvent = function () {
    searchBar.addEventListener('keyup', async function (event) {
      event.preventDefault();
      if (event.keyCode === 13) {

        list = (await axios.get('http://dblp.ourguide.xyz/papers/search',
          {
            params: {
              q: searchBar.value
            }
          })).data;

        searchList.innerHTML = '';
        _.forEach(list, e => {
          searchList.innerHTML += searchItem(e.title, e.authors);
        });
      }
    })
  };

  this.drawNode = function () {
    const target = _.groupBy(list, 'cluster');

    const diff = parent.width / Object.keys(target).length;
    _.forEach(target, (nodes,i) => {
      _.forEach(nodes, node => {
        parent.drawNode(diff*Math.random() + diff*i, nodesGroupByYear[node.year], {color: colorMap[node.cluster]});
        child.drawNode(diff*Math.random() + diff*i, nodesGroupByYear[node.year], {color: colorMap[node.cluster]});
      });
    });

  };
  
  this.addSearchEvent();
  this.drawNode();

}) ();
