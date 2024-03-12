// EDITABLE CONTENT
window.onload = function () {
  var plName = document.getElementById("pl-name");
  plName.contentEditable = true;

  var plDesc = document.getElementById("pl-desc");
  plDesc.contentEditable = true;
}

// IMAGE CHANGER
document.getElementById("pl-img").addEventListener("click", function () {
  var imgElement = document.getElementById("pl-img");
  var userInput = prompt("Enter Image Address: ");
  if (userInput !== null && userInput !== "") {
    var isJpg = userInput.toLowerCase().slice(-4) === ".jpg";
    var isPng = userInput.toLowerCase().slice(-4) === ".png";
    var isWebP = userInput.toLowerCase().slice(-5) === ".webp";
    if ((isJpg || isPng) || isWebP) {
      imgElement.src = userInput;
      console.log("Image set.");
    } else {
      console.log("URL not valid.");
    }
  } else {
    console.log("No URL provided.");
  }
});

// PLAYLIST DESCRIPTION WORD COUNT LIMIT
document.addEventListener('DOMContentLoaded', function () {
  var textInput = document.getElementById('pl-desc');
  var charCount = document.getElementById('char-count');
  var maxCharCount = 130;

  textInput.addEventListener('input', function () {
    var inputCount = textInput.textContent.length;
    var remainingCount = maxCharCount - inputCount;
    if (remainingCount >= 0) {
      textInput.setAttribute('contenteditable', 'true');
      charCount.textContent = 'Remaining characters: ' + remainingCount;
    } else {
      textInput.setAttribute('contenteditable', 'false');
      charCount.textContent = '';
    }
  });
});

async function getToken(clientId, clientSecret) {
  const urlAuth = 'https://accounts.spotify.com/api/token';

  const configAuth = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  };
  const token_json = fetch(urlAuth, configAuth).then((data) => data.json());
  return token_json;
}

async function getSearch(access_token, query) {
  const encodedQuery = encodeURIComponent(query)
  const urlSearch = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track`;

  const configAuth = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  };
  const search_result_json = fetch(urlSearch, configAuth).then((data) => data.json())
  return search_result_json;
}

async function searchSpotify() {
  const clientId = "f6fbac7823af4c6797e7b9db6d9b9007";
  const clientSecret = "1c14cd82c8ca400c992dae3402573f87";
  const songInput = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.innerHTML = '';

  const resp_json = await getToken(clientId, clientSecret);
  const access_token = resp_json["access_token"];

  const search_result_json = await getSearch(access_token, songInput.value);
  let spotifySearch = search_result_json["tracks"]["items"];

  spotifySearch.forEach((item) => {
    const resultItem = document.createElement('div');
    console.log(item["name"])
    resultItem.innerHTML = `<strong>${item["name"]}</strong> by ${item["artists"][0]["name"]}`;
    resultsContainer.appendChild(resultItem);
  });

  const songFrames = document.querySelector('.added-songs');

  spotifySearch.forEach((item) => {
      const iframe = document.createElement('iframe');
      
      const uri = item["artists"][0]["uri"];
      iframe.src = `https://open.spotify.com/embed/artist/${uri.split(':')[2]}`;
      
      iframe.width = "500px";
      iframe.height = "auto";
      iframe.frameborder = "5";
      iframe.allowtransparency = "true";
      iframe.allow = "encrypted-media";
      
      songFrames.appendChild(iframe);
  });



}