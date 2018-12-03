const searchBar = document.getElementById('search-input');

searchBar.addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      console.log(searchBar.value);
    }
});