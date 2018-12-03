const searchBar = document.getElementById('search-input');
const searchList = document.getElementById('search-list');
const searchItem = (title, authors) => `<div class="item">
    <div class="title">${title}</div>
    <div class="author">${authors}</div>
</div>`;
let data = {};

searchBar.addEventListener('keyup', async function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {

      data = (await axios.get('http://dblp.ourguide.xyz/papers/search',
        {
          params : {
            q: searchBar.value
          }
        })).data;

      searchList.innerHTML = '';
      _.forEach(data, e => {
        searchList.innerHTML += searchItem(e.title, e.authors);
      });

      console.log(data);

    }
});


