function setup() {
  makePageForShows(allShows);
  let templateEpi = document.getElementById('episode-template');
  let templateShow = document.getElementById("show-template");
  templateEpi.style.display = "none";
  templateShow.style.display = "none";

}

//generate sorted list of all shows to add to drop down selection
let allShows = getAllShows();
allShows.sort((a, b) => {
  return (a.name > b.name && 1) || -1;
});
//create select option for shows, ID already defined in HTML file
let selectShowDropDown = document.getElementById("select-show");

//add all shows as options in the select show input
allShows.forEach((show) => {
  let optionShow = document.createElement("option");
  let showOption = show.name;
  optionShow.innerHTML = showOption;
  optionShow.value = show.id;
  selectShowDropDown.appendChild(optionShow);
});

// creating variables for all previous cards displaying on page
// also for all the previous episodes in the select episode drop down list.
let allPreviousCards = document.getElementsByClassName("episode-card");
let allPreviousEpisodesSelect =
  document.getElementsByClassName("episodeOptions");

//add event listener to select show option, that fetches the show data
selectShowDropDown.addEventListener("change", (e) => {
  let showSelected = e.target.value;
  if (showSelected === "All shows") {
    // show a list of all shows on the screen
    removeElementsByClass("episode-card");
    removeElementsByClass("episodeOptions");
    return;
  } else if (showSelected !== "All shows") {
    // fetch to get correct show data using ID
    fetch(`https://api.tvmaze.com/shows/${showSelected}/episodes`)
      .then((response) => response.json())
      .then((showData) => {
        for (let i = 0; i < allPreviousCards.length; i++) {
          removeElementsByClass("episode-card");
          removeElementsByClass("episodeOptions");
        }
        makePageForEpisodes(showData);
      })
      .catch((err) => console.log(`Error: ${err}`));
  } else {
    console.log("Error");
  }
});

//function to remove all elements of a certain class, to remove previous episode cards and lists options
function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

let cardsContainer = document.querySelector(".cards-container");
let templateCardEpisode = document.getElementById("episode-template");
let templateCardShow = document.getElementById("show-template");

function makePageForEpisodes(episodeList) {
  const episodesDisplayed = document.getElementById("episodes-displayed");
  episodesDisplayed.textContent = `Displaying ${episodeList.length} episodes`;

  //organise and display the episode data on the page
  episodeList.forEach((episode) => {
    let card = templateCardEpisode.cloneNode(true);
    card.setAttribute("class", "episode-card"); //main card that holds all episode information
    card.style.display = "";
    cardsContainer.appendChild(card);
    let nameEpisode = card.querySelector(".episode-name");
    let imgEpisode = document.createElement("img");
    let imgContainer = card.querySelector(".episode-image");
    imgEpisode.setAttribute("src", episode.image.medium);
    imgContainer.appendChild(imgEpisode);
    let codeEpisode = card.querySelector(".episode-code");
    let sumEpisode = card.querySelector(".episode-summary");

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
    // imgEpisode.innerHTML = episode.image.medium;
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
      // to display the number of episodes showing on the page
      let allHidden = document.getElementsByClassName("hidden");
      numDisplayed = episodeList.length - allHidden.length;
      episodesDisplayed.textContent = `Displaying ${numDisplayed}/${episodeList.length} episodes`;
    });

    //add all episodes as options in the select input
    let selectDropDown = document.getElementById("select-episodes");
    let optionEp = document.createElement("option");
    optionEp.className = "episodeOptions";
    let episodeOption = `${codeEpisode.innerHTML} - ${nameEpisode.innerHTML}`;
    optionEp.innerHTML = episodeOption;
    optionEp.value = codeEpisode.innerHTML; //the actual value is the episode code, so that I can use this value to match with the corresponding episode
    selectDropDown.appendChild(optionEp);

    //add event listener to selected episode option, that shows that episode card only
    selectDropDown.addEventListener("change", (e) => {
      let optionSelected = e.target.value;
      if (optionSelected === "All episodes") {
        card.style.display = "";
        episodesDisplayed.textContent = `Displaying ${episodeList.length} episodes`;
        //to show all the episodes (removes any display:"none")
        return;
      } else if (optionSelected === codeEpisode.innerHTML) {
        //to match with the corresponding episode code
        card.style.display = "";
        episodesDisplayed.textContent = `Displaying 1 episode`; //hardcoded - always only show 1 episode, when selecting individual episodes options
      } else {
        card.style.display = "none";
      }
    });
  });
}

//function for making Showlist on page;

function makePageForShows(showList) {
  const showsDisplayed = document.getElementById("episodes-displayed");
  showsDisplayed.textContent = `Displaying ${showList.length} shows`;

  //organise and display the episode data on the page
  showList.forEach((show) => {
    let card = templateCardShow.cloneNode(true);
    // card.removeAttribute("id");
    card.setAttribute("class", "show-card"); //main card that holds all episode information
    cardsContainer.appendChild(card);
    let nameShow = card.querySelector(".show-name");
    let imgShow = document.createElement("img");
    let imgContainer = card.querySelector(".show-image");
    if (show.image === null) {
      imgShow.src = "";
    } else {
      imgShow.setAttribute("src", show.image.medium);
      imgContainer.appendChild(imgShow);
    }

    let genreShow = card.querySelector(".show-genre");
    let sumShow = card.querySelector(".show-summary");
    let ratingShow = card.querySelector(".show-rating");
    let runtimeShow = card.querySelector(".show-runtime");
    let statusShow = card.querySelector(".show-status");

    //populate the elements with the relevant episode details
    // imgEpisode.innerHTML = episode.image.medium;
    nameShow.innerHTML = show.name;
    genreShow.innerHTML = `Genre: ${show.genres}`;
    sumShow.innerHTML = show.summary;
    ratingShow.innerHTML = `Average rating: ${show.rating.average}/10`;
    runtimeShow.innerHTML = `Episode length: ${show.runtime} mins`;
    statusShow.innerHTML = `Status: ${show.status}`;

    //created a live search feature
    //target search bar, add event listener, for each input.
    let searchBar = document.getElementById("searchBar");
    let searchString = "";

    //add event listener to each card, that fetches the show data
    imgContainer.addEventListener("click", (e) => {
      fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`)
        .then((response) => response.json())
        .then((showData) => {
          for (let i = 0; i < allPreviousCards.length; i++) {
            removeElementsByClass("show-card");
            // removeElementsByClass("episodeOptions");
          }
          makePageForEpisodes(showData);
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        })
        .catch((err) => console.log(`Error: ${err}`));
    });

    searchBar.addEventListener("input", (e) => {
      searchString = e.target.value.toLowerCase();
      console.log(typeof show.genres + typeof show.name);
      if (
        !show.name.toLowerCase().includes(searchString) &&
        !show.summary.toLowerCase().includes(searchString) &&
        !show.genres.includes(searchString)
      ) {
        card.style.display = "none";
        card.classList.add("hidden");
      } else {
        card.style.display = "";
        card.classList.remove("hidden");
      }
      // to display the number of shows showing on the page
      let allHidden = document.getElementsByClassName("hidden");
      numDisplayed = showList.length - allHidden.length;
      showsDisplayed.textContent = `Displaying ${numDisplayed}/${showList.length} shows`;
    });
  });
}

window.onload = setup;
