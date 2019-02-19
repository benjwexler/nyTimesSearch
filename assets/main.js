searchNyTimes = (searchTerm, startYear, endYear, limit) => {
  var apiKey = "0SuFB0a2qYy5AjHWz2bGZ6aR4XppQFFc";
  var queryURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm}&api-key=${apiKey}`;

  if (startYear.trim().length !== 0) {
    startYear = `${startYear}0101`;
    queryURL += `&start_date=${startYear}`;
  }

  if (endYear.trim().length !== 0) {
    endYear = `${endYear}0101`;
    queryURL += `&end_date=${endYear}`;
  }

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    displaySearchResults(response, limit);
  });
};

let displaySearchResults = (response, limit) => {
  $("#displayResultsContainer").empty();

  let articlesArray = response.response.docs;

  for (let i = 0; i < limit; i++) {
    let relativeImgPath;
    let imgUrl = "assets/pics/imgNotAvailable.png";

    if (articlesArray[i].multimedia.length > 0) {
      relativeImgPath = articlesArray[i].multimedia[0].url;
      imgUrl = `https://static01.nyt.com/${relativeImgPath}`;
    }

    let linkToArticle = articlesArray[i].web_url;
    let headline = articlesArray[i].headline.main;
    let snippet = articlesArray[i].snippet;

    createCard(imgUrl, headline, snippet, linkToArticle);
  }
};

let createCard = (imgUrl, headline, snippet, linkToArticle) => {
  let col = $("<div>");
  $(col).attr("class", "col-sm-4");
  let card = $("<div>");
  $(card).attr("class", "card");
  $(col).append(card);
  let img = $(`<img src='${imgUrl}' class='card-img-top'/>`);
  $(card).append(img);
  let cardBody = $("<div>");
  $(cardBody).attr("class", "card-body");
  $(card).append(cardBody);
  let h5 = $(`<h5>${headline}</h5>`);
  $(h5).attr("class", "card-title");
  $(cardBody).append(h5);
  let p = $(`<p class='card-text'>${snippet}</p>`);
  $(cardBody).append(p);
  let a = $(`<a href='${linkToArticle}' class='btn btn-primary'>Read Article</a>`);
  $(cardBody).append(a);

  $("#displayResultsContainer").append(col);
};

let processUserReq = event => {
  event.preventDefault();
  let searchTerm = $("#searchTerm").val();
  let startYear = $("#startYear").val();
  let endYear = $("#endYear").val();
  let limit = $("#limit").val();

  searchNyTimes(searchTerm, startYear, endYear, limit);
};

$("form").on("submit", processUserReq);
