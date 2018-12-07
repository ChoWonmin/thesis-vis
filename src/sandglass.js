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

  const main = new Plane(d3.select('#main'));

  this.drawAxis = function (startYear, lastYear) {
    const padding = 30;
    const num = lastYear - startYear + 1;
    const diff = (main.height- 2*padding) / (num-1);

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

  this.render = function (parent, offspring) {

    main.clear();
    this.drawAxis(parent.year - 15, parent.year + 15);
    main.drawBox(main.mappingY[parent.year], parent.title, parent.authors);

    console.log(Object.keys(parent.group).length, Object.keys(offspring.group).length);
    console.log(offspring);

    _.forEach(parent.group, e => {
      main.drawNode(Math.random()*main.axisLength, main.mappingY[e.year], {color: colorMap[1]});
    });

    _.forEach(offspring.group, e => {
      main.drawNode(Math.random()*main.axisLength, main.mappingY[e.year], {color: colorMap[2]});
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
            const parent = (await axios.get(`http://dblp.ourguide.xyz/papers/${id}/ancestor`,{
              params: {
                value: 5
              }
            })).data;
            const offspring = (await axios.get(`http://dblp.ourguide.xyz/papers/${id}/offspring`,{
              params: {
                value: 5
              }
            })).data;

            that.render(parent, offspring);
          });
        });
      }
    })
  };

  this.drawNode = function () {
    const target = _.groupBy(list, 'cluster');

    const diff = main.width / Object.keys(target).length;
    _.forEach(target, (nodes,i) => {
      _.forEach(nodes, node => {
        main.drawNode(diff*Math.random() + diff*i, lineGroupByYear[node.year], {color: colorMap[node.cluster]});
      });
    });

  };


  this.addSearchEvent();
  logoBtn.addEventListener('click', (event) => {
    main.clear();
    console.log('clear');
  })

}) ();
