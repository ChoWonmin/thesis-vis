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
  const target = {
    self: {},
    parents: {},
    offsprings: {}
  };

  const main = new Plane(d3.select('#main'));

  this.init = function (year) {
    const padding = 30;
    const num = 31;
    const diff = (main.height- 2*padding) / (num-1);

    main.clear();

    for (let i=1; i<= 15 ; i++) {
      const py = diff * (-i) + padding;
      const oy = diff * i + padding
      main.mappingY[year + i] = y;;
      main.mappingY[year - i] = y;

      if (i%5===0)  {
        main.drawAxisX(py, lastYear-i, '#9B9B9B');
        main.drawAxisX(oy, lastYear-i, '#9B9B9B');
      } else {
        main.drawAxisX(py);
        main.drawAxisX(oy);
      }

    }
  };

  let list = {}; //(await axios.get('http://dblp.ourguide.xyz/papers/f14df1ed-e3e9-4348-9040-fc06e3411b95/ancestor')).data;

  this.update = function () {

  }

  this.render = function (target) {
    console.log(target);

    main.drawBox(main.mappingY[target.self.year], target.self.title);

    _.forEach(target.parents, yearGroup => {
      try {
        const startPoint = main.axisLength/2 - (2*main.nodeRadius)*yearGroup.length/2;
        _.forEach(yearGroup, (node, i) => {
          main.drawNode(startPoint + i*(2*main.nodeRadius), main.mappingY[node.year], {color: colorMap[1]});
        });
      } catch (err) {
        console.log(err);
      }
    });

    _.forEach(target.offsprings, yearGroup => {
      try {
        _.forEach(yearGroup, (node, i) => {
          const startPoint = main.axisLength/2 - (2*main.nodeRadius)*yearGroup.length/2;
          main.drawNode(startPoint + i*(2*main.nodeRadius), main.mappingY[node.year], {color: colorMap[2]});
        });
      } catch (err) {
        console.log(err);
      }
    });

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
            target.parents = _.groupBy((await axios.get(`http://dblp.ourguide.xyz/papers/${id}/ancestor`,{
              params: {
                value: 5
              }
            })).data.group, 'year');
            target.offsprings = _.groupBy((await axios.get(`http://dblp.ourguide.xyz/papers/${id}/offspring`,{
              params: {
                value: 5
              }
            })).data.group, 'year');

            that.init(target.self.year);
            that.update();
            that.render(target);
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
