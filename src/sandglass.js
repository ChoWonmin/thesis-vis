const sandglass = (async function() {

  const searchBar = document.getElementById('search-input');
  const searchList = document.getElementById('search-list');
  const searchItem = (title, authors, id) => {
    const item = document.createElement('div');
    item.setAttribute('id', id);
    item.classList.add('item');

    const titleEle = document.createElement('div');
    titleEle.classList.add('title');
    titleEle.innerHTML = title;

    const authorsEle = document.createElement('div');
    authorsEle.classList.add('author');
    authorsEle.innerHTML = authors;

    item.appendChild(titleEle);
    item.appendChild(authorsEle);

    return item;
  };

  const logoBtn = document.getElementsByClassName('logo')[0];

  const colorMap = [
    '#c62828',
    '#c2185b',
    '#311b92',
    '#304ff3',
    '#00b8d4',
    '#2e7d32',
    '#ffd600',
    '#ffa000',
    '#4e342e',
    '#37474f'
  ];
  const that = this;
  const group = [];
  let currentGroup = 0;
  const target = {
    self: {},
    parents: {},
    offsprings: {}
  };

  const main = new Plane(d3.select('#main'));

  // const nodde = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  // main.drawForceSimulation(nodde, 0, 200);
  // main.drawForceSimulation(nodde, 0, 500);

  this.init = function (year) {
    const padding = 30;
    const num = 31;
    const diff = (main.height- 2*padding) / (num-1);

    main.clear();

    main.mappingY[year] = main.origin.y;
    main.drawAxisX(0, year, '#9B9B9B');

    for (let i=1; i<= 15 ; i++) {
      const py = diff * (-i);
      const oy = diff * i;
      main.mappingY[year - i] = main.origin.y + py;
      main.mappingY[year + i] = main.origin.y + oy;

      if (i%5===0)  {
        main.drawAxisX(py, year-i, '#9B9B9B');
        main.drawAxisX(oy, year+i, '#9B9B9B');
      } else {
        // main.drawAxisX(py);
        // main.drawAxisX(oy);
      }
    }

  };

  let list = {}; //(await axios.get('http://dblp.ourguide.xyz/papers/f14df1ed-e3e9-4348-9040-fc06e3411b95/ancestor')).data;

  this.update = function () {

  };

  this.render = function () {
    main.drawBox(main.mappingY[target.self.year], target.self.title);

    let nodes = [];
    for (let i=1; i<=15; i++) {
      const yearGroup  = target.parents[target.self.year - i];

      if (i%5==0) {
        if (nodes.length >= 1) {
          main.drawForceSimulation(nodes, 0, main.mappingY[target.self.year - i+3], colorMap[0]);
          main.drawLine({x:0, y:main.mappingY[target.self.year]},{x:0, y:main.mappingY[target.self.year - i+3]},{strokeWidth: 10, color:colorMap[0]});
        }
        nodes = [];
      }

      _.forEach(yearGroup, e=> {
        nodes.push({});
      });
    }

    nodes = [];
    for (let i=1; i<=15; i++) {
      const yearGroup  = target.offsprings[target.self.year + i];

      if (i%5==0) {
        if (nodes.length >= 1) {
          main.drawForceSimulation(nodes, 0, main.mappingY[target.self.year + i-2], colorMap[2]);
          main.drawLine({x:0, y:main.mappingY[target.self.year]},{x:0, y:main.mappingY[target.self.year + i-2]},{strokeWidth: 10, color: colorMap[2]});
        }

        nodes = [];
      }

      _.forEach(yearGroup, e=> {
        nodes.push({});
      });
    }

  };

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
          const item = searchItem(e.title, e.authors, e._id);
          searchList.appendChild(item);

          item.addEventListener('click', async function (event) {
            const id = this.getAttribute('id');

            target.self = (await axios.get(`http://dblp.ourguide.xyz/papers/${id}/info`)).data;

            target.parents = _.chain((await axios.get(`http://dblp.ourguide.xyz/papers/${id}/ancestor`,{
              params: {
                value: 3
              }
            })).data.group).map(e => {
              e.group = currentGroup;
              return e;
            }).groupBy('year').value();

            currentGroup++;
            target.offsprings = _.chain((await axios.get(`http://dblp.ourguide.xyz/papers/${id}/offspring`,{
              params: {
                value: 7
              }
            })).data.group).map(e => {
              e.group = currentGroup;
              return e;
            }).groupBy('year').value();

            that.init(target.self.year);
            that.update();
            that.render();
          });
        });
      }
    })
  };

  this.addSearchEvent();
  logoBtn.addEventListener('click', (event) => {
    main.clear();
  })

}) ();
