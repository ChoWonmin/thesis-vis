const searchBar = document.getElementById('search-input');

searchBar.addEventListener('keyup', async function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {

      const data = (await axios.get('http://dblp.ourguide.xyz/papers/search',
        {
          params : {
            q: searchBar.value
        }
      })).data;

      console.log(data);

    }
});


