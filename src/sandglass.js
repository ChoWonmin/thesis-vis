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

  this.init = function (startYear, lastYear) {
    const padding = 30;
    const num = lastYear - startYear + 1;
    const diff = (main.height- 2*padding) / (num-1);

    main.clear();

    for (let i=0; i< num ; i++) {
      const y = diff * i + padding;
      main.mappingY[lastYear - i] = y;

      if (i%5===0)
        main.drawAxisX(y, lastYear-i, '#9B9B9B');
      else
        main.drawAxisX(y);
    }
  };

  let list = {}; //(await axios.get('http://dblp.ourguide.xyz/papers/f14df1ed-e3e9-4348-9040-fc06e3411b95/ancestor')).data;

  this.update = function () {

  }

  this.render = function (target) {
    console.log(target);
    //console.log(Object.keys(target.parents.length, Object.keys(target.offsprings).length));

    main.drawBox(main.mappingY[target.self.year], target.self.title, target.self.authors);
    _.forEach(target.parents, e => {
      try {
        main.drawNode(Math.random()*main.axisLength, main.mappingY[e.year], {color: colorMap[1]});
      } catch (err) {
        console.log(err);
      }
    });

    _.forEach(target.offsprings, e => {
      try {
        main.drawNode(Math.random()*main.axisLength, main.mappingY[e.year], {color: colorMap[2]});
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
            target.parents = (await axios.get(`http://dblp.ourguide.xyz/papers/${id}/ancestor`,{
              params: {
                value: 5
              }
            })).data.group;
            target.offsprings = (await axios.get(`http://dblp.ourguide.xyz/papers/${id}/offspring`,{
              params: {
                value: 5
              }
            })).data.group;

            that.init(target.self.year - 15, target.self.year + 15);
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
    console.log('clear');
  })

}) ();
