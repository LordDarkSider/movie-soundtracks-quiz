//Chargement des donnees JSON des soundtracks
let data = null
var requestURL = 'https://lorddarksider.github.io/movie-soundtracks-quiz/data/soundtracks.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'text';
request.send();

request.onload = function() {
    var json = request.response;
    data = new Map(Object.entries(JSON.parse(json)));
    data.forEach(function(value, key, map){
        data.set(key,new Map(Object.entries(value)));
        data.get(key).set("titles",new Map(Object.entries(data.get(key).get("titles"))));
    });
};

request.onerror = function() {
    location.replace('main_error.html')
};