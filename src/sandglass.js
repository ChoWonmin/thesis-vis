const sandglass = (async function() {

  const searchBar = document.getElementById('search-input');
  const searchList = document.getElementById('search-list');
  const searchItem = (title, authors) => `<div class="item">
      <div class="title">${title}</div>
      <div class="author">${authors}</div>
  </div>`;

  const parent = new Plane(d3.select('#parent'));
  const child = new Plane(d3.select('#child'));
  

  this.drawAxis = function () {
    const startYear = 2000;
    const lastYear = 2018;
    const padding = 30;
    const num = lastYear - startYear;
    const diff = (parent.height- padding) / (num-1);
    const res = {};

    for (let i=0; i< num; i++) {
      res[startYear + i] = diff * i;
      parent.drawAxisX(diff * i, startYear+i);
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
    console.log(target);
    console.log(nodesGroupByYear);
  };
  
  //this.addSearchEvent();
  this.drawNode();

}) ();
