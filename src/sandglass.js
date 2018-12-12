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

  this.renderBackground = function () {
    const year = target.self.year;

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

  this.update = async function (id) {
    target.self = (await axios.get(`http://dblp.ourguide.xyz/papers/${id}/info`)).data;

    let tmp = (await axios.get(`http://dblp.ourguide.xyz/papers/${id}/ancestor`,{
      params: {
        value: 1
      }
    })).data.group;

    target.parents = _.groupBy(tmp, 'year');

    tmp = _.map(tmp, (e, key)=>key);
    target.leaderP = (await axios.post('http://dblp.ourguide.xyz/papers/representative',{
      group: tmp
    })).data;

    /* offspring */
    tmp = (await axios.get(`http://dblp.ourguide.xyz/papers/${id}/offspring`,{
      params: {
        value: 7
      }
    })).data.group;

    target.offsprings = _.groupBy(tmp, 'year');

    const ccId = _.orderBy(tmp,'result','desc')[0]._id;

    tmp = (await axios.get(`http://dblp.ourguide.xyz/papers/${ccId}/offspring`,{
      params: {
        value: 1
      }
    })).data.group;

    target.cc = _.groupBy(tmp, 'year');
  };

  this.render = function (x) {
    main.drawBox(main.mappingY[target.self.year], target.self.title);

    let nodes = [];
    for (let i=1; i<=15; i++) {
      const yearGroup  = target.parents[target.self.year - i];

      if (i%5==0) {
        if (nodes.length >= 1) {
          main.drawForceSimulation(nodes, 0, main.mappingY[target.self.year - i+3], colorMap[0], target.self._id);
          main.drawLine({x:0, y:main.mappingY[target.self.year]-15},{x:0, y:main.mappingY[target.self.year - i+3]},{strokeWidth: 10, color:colorMap[0]});
        }
        nodes = [];
      }

      _.forEach(yearGroup, e=> {
        nodes.push(e);
      });
    }

    nodes = [];
    for (let i=1; i<=15; i++) {
      const yearGroup  = target.offsprings[target.self.year + i];

      if (i%5==0) {
        if (nodes.length >= 1) {
          main.drawForceSimulation(nodes, 0, main.mappingY[target.self.year + i-2], colorMap[2]);
          main.drawLine({x:0, y:main.mappingY[target.self.year]+15},{x:0, y:main.mappingY[target.self.year + i-2]},{strokeWidth: 10, color: colorMap[2]});
        }

        nodes = [];
      }

      _.forEach(yearGroup, e=> {
        nodes.push(e);
      });
    }

    nodes = [];
    for (let i=1; i<=15; i++) {
      const yearGroup  = target.cc[target.self.year + i];

      if (i%5==0) {
        if (nodes.length >= 1) {
          main.drawForceSimulation(nodes, 200, main.mappingY[target.self.year + i-2], colorMap[3]);
          //main.drawLine({x:200, y:main.mappingY[target.self.year]+15},{x:0, y:main.mappingY[target.self.year + i-2]},{strokeWidth: 10, color: colorMap[3]});
        }

        nodes = [];
      }

      _.forEach(yearGroup, e=> {
        nodes.push(e);
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

            await that.update(id);
            that.renderBackground(target.self.year);
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