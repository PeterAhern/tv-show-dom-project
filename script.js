function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}
let numOfHidden;

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Displaying ${episodeList.length} episodes`;

  //organise and display the episode data on the page
  episodeList.forEach((episode) => {
    let cardsContainer = document.querySelector(".cards-container");
    let card = document.createElement("div"); //main card that holds all episode information
    card.setAttribute("class", "episode-card");
    cardsContainer.appendChild(card);

    let nameEpisode = document.createElement("div");
    nameEpisode.setAttribute("class", "episode-name");
    card.appendChild(nameEpisode);

    let imgEpisode = document.createElement("img");
    imgEpisode.setAttribute("class", "episode-image");
    imgEpisode.setAttribute("src", episode.image.medium);
    card.appendChild(imgEpisode);

    let codeEpisode = document.createElement("div");
    codeEpisode.setAttribute("class", "episode-code");
    card.appendChild(codeEpisode);

    let sumEpisode = document.createElement("div");
    sumEpisode.setAttribute("class", "episode-summary");
    card.appendChild(sumEpisode);

    //conditions to refactor season/episode number into episode code
    let seasonNum = episode.season;
    let episodeNum = episode.number;
    if (seasonNum < 10) {
      seasonNum = `0${seasonNum}`;
    }
    if (episodeNum < 10) {
      episodeNum = `0${episodeNum}`;
    }
    //populate the elements with the relevant episode details
    imgEpisode.innerHTML = episode.image.medium;
    nameEpisode.innerHTML = episode.name;
    codeEpisode.innerHTML = `S${seasonNum}E${episodeNum}`;
    sumEpisode.innerHTML = episode.summary;

    //created a live search feature
    //target search bar, add event listener, for each input.
    let searchBar = document.getElementById("searchBar");
    let searchString = "";

    searchBar.addEventListener("input", (e) => {
      searchString = e.target.value.toLowerCase();
      if (
        !episode.name.toLowerCase().includes(searchString) &&
        !episode.summary.toLowerCase().includes(searchString)
      ) {
        card.style.display = "none";
        card.classList.add("hidden");
      } else {
        card.style.display = "";
        card.classList.remove("hidden");
      }
      let allHidden = document.getElementsByClassName("hidden");
      numDisplayed = episodeList.length - allHidden.length;
      rootElem.textContent = `Displaying ${numDisplayed}/${episodeList.length} episodes`;
    });
  });
}

window.onload = setup;
