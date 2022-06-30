let selectlang = document.getElementById('selectlang');
let flag = document.getElementById('flag');
let bloc_menu = document.getElementById('menu');
let infobulle = document.getElementById('infobulle');
let bloc_config1 = document.getElementById('config1');
let mcq_choice = document.getElementById('mcq_choice');
let normal_choice = document.getElementById('normal_choice');
let time_choice = document.getElementById('time_choice');
let bloc_config2 = document.getElementById('config2');
let play_button = document.getElementById('play_button');
let back_button = document.getElementById('back_button');
let back_button2 = document.getElementById('back_button2');
let bloc_game = document.getElementById('bloc_game');
let bloc_entry = document.getElementById('bloc_entry');
let bloc_end = document.getElementById('bloc_end');
var input = document.getElementById("reponse_entry");
let datalist = document.getElementById("datalist");
let valide_button = document.getElementById("valide_button");
let skip_button = document.getElementById("skip_button");
let bloc_results = document.getElementById('bloc_results');
let solution = document.getElementById('solution');
let link = document.getElementById('link');
let next_button = document.getElementById("next_button");
let poster = document.getElementById('poster');
let bloc_mcq = document.getElementById('bloc_mcq');
let progression = document.getElementById('progression');
let score_label = document.getElementById('score_label');
let timer = document.getElementById('timer');
let answer1 = document.getElementById('answer1');
let answer2 = document.getElementById('answer2');
let answer3 = document.getElementById('answer3');
let answer4 = document.getElementById('answer4');
let score_end_label = document.getElementById('score_end_label');


function change_language(){
    var language = selectlang.value;
    flag.src = config_language.get('flagsrc').get(language);
    mcq_choice.innerHTML = config_language.get('buttons').get(language)[0];
    normal_choice.innerHTML = config_language.get('buttons').get(language)[1];
    time_choice.innerHTML = config_language.get('buttons').get(language)[2];
    play_button.innerHTML = config_language.get('buttons').get(language)[3];
    back_button.innerHTML = config_language.get('buttons').get(language)[4];
    back_button2.innerHTML = config_language.get('buttons').get(language)[4];
    skip_button.innerHTML = config_language.get('buttons').get(language)[5];
    next_button.innerHTML = config_language.get('buttons').get(language)[6];
    input.placeholder = config_language.get('placeholder').get(language);
    if (bloc_game.style.display=='block'){suggestions_reload(language);};
};

function suggestions_reload(language){
    suggestions = [];
    for(var i = 1; i < data.size+1; i++){suggestions.push(data.get(String(i)).get('titles').get(language))};
};

function infobulle_show(b){
    var language = selectlang.value;
    infobulle.value = config_language.get('infobulle').get(language)[b];
};

function infobulle_hide(){
    if (bloc_config1.style.display=="block") {infobulle.value = "";}
};

function change_mode(m){
    mode = m;
    bloc_config1.style.display = "none";
    bloc_config2.style.display = "block";
};

function back(){
    bloc_config1.style.display = "block";
    bloc_config2.style.display = "none";
};

function play(){
    bloc_menu.style.display = "none";
    bloc_game.style.display = "block";
    timer.style.display='none';
    var language = selectlang.value;
    score = 0;
    score_label.innerHTML = ('Score: '+String(score));
    input.placeholder = config_language.get('placeholder').get(language);
    suggestions_reload(language);
    
    if (mode=='mcq'){nb_movies=20} else if (mode=='normal'){nb_movies=10} else {return time_trial()};
    
    tracklist = [];
    ntrack = 0;
    tirage(nb_movies);
    num = String(tracklist[ntrack]);
    poster.src = ('https://www.themoviedb.org/t/p/w600_and_h900_bestv2/'+ data.get(num).get('id') +'.jpg');
    poster.addEventListener('loadend', round(num));
};

function next(){
    musique.pause();
    datalist.options= Array([]); //remove all options in datalist
    ntrack+=1;
    if(ntrack == nb_movies){return end()};
    num = String(tracklist[ntrack]);
    setTimeout(function(){round(num)} ,500);
};

function round(num){
    bloc_entry.style.display = "block";
    bloc_results.style.display = "none";
    next_button.style.display='none';
    skip_button.style.display='block';
    link.style.display='none';
    valide_button.disabled = true;
    var language = selectlang.value;

    if (mode=='mcq'){poster.style.display='none'; bloc_entry.style.display='none'; bloc_mcq.style.display='block';
    var answers = [num];
    for(var i = 0; i < 3; i++)
    {var n = Math.floor(Math.random()*data.size +1); while(tracklist.slice(0,ntrack+1).indexOf(n)>-1 && answers.indexOf(n)>-1){n = Math.floor(Math.random()*data.size +1)}; answers.push(n);};
    var objets = [answer1, answer2, answer3, answer4]
    for(var i = 0; i < 4; i++)
    {var n = Math.floor(Math.random()*answers.length); y = data.get(String(answers[n])).get('titles').get(language);  objets[i].innerHTML = y; objets[i].value = y; answers.splice(n,1)}
    }
    
    else{poster.style.display='block'; bloc_entry.style.display='block'; bloc_mcq.style.display='none'};

    id = data.get(num).get('id')
    composer = data.get(num).get('composer')
    poster.style.filter = 'blur(2em)';
    if (ntrack!=0) {poster.src = ('https://www.themoviedb.org/t/p/w600_and_h900_bestv2/'+ data.get(num).get('id') +'.jpg')};
    progression.innerHTML = ('n° '+String(ntrack+1)+'/'+String(nb_movies));
    
    musique = new Audio('themes/'+id+'.mp3');
    musique.loop=true;
    musique.onloadeddata = (event) => {
        musique.play();
        if (mode=='mcq'){x=45} else if (mode=='normal'){x=60};
        out = setTimeout(timeout, x*1000);
        timer_change();
        t = setInterval(timer_change, 1000);
    };

    input.focus()
};

function verification(){
    if (mode=='mcq'){var reponse = mcq_value.toLowerCase()} else{var reponse = input.value.toLowerCase()};
    var movie = Array.from(data.get(num).get('titles').values());
    for(var i = 0; i < movie.length; i++){if(reponse==movie[i].toLowerCase()){return result(num,'correct')}}
    result(num,'incorrect');
};

function result(num, etat){
    clearTimeout(out);
    clearInterval(t);
    timer.style.display='none';
    skip_button.style.display='none';
    next_button.style.display='block';
    link.style.display='block';

    if (mode=='mcq'){poster.style.display='block'; bloc_mcq.style.display='none'}
    
    musique.loop=false;
    bloc_entry.style.display = "none";
    bloc_results.style.display = "block";
    poster.style.filter = 'blur(0em)';
    input.value = '';
    
    if(etat=='correct'){var color = 'green'; var ico = 'images/correct.png'; if (mode=='normal'){score+= (x*1.25)+25 } else{score+= 100}}
    else if (etat=='incorrect'){var color = 'red'; var ico = 'images/incorrect.png';};
    
    var language = selectlang.value;
    var sol = data.get(num).get('titles').get(language);
    var composer = data.get(num).get('composer');
    
    solution.innerHTML = ("<img src='"+ico+"'> "+sol+' ('+composer+')');
    score_label.innerHTML = ('Score: '+String(Math.round(score)));
    solution.style.color = color;
    link.href= 'https://www.youtube.com/playlist?list=' + data.get(num).get('ytblink');
    next_button.innerHTML = config_language.get('buttons').get(language)[6];
};

function end(){
    bloc_game.style.display='none';
    bloc_end.style.display='block';
    if(mode=='trial'){return score_end_label.innerHTML = ('Score: '+String(score));}
    else{score_end_label.innerHTML = ('Score: '+String(Math.round(score))+'/1000')};
};

function time_trial(){

};

function tirage(N){
    for(var i = 0; i < N; i++){
        var n = Math.floor(Math.random()*data.size +1);
        while(tracklist.indexOf(n)>-1){n = Math.floor(Math.random()*data.size +1)};
        tracklist.push(n);
        // poster preloading
        imageObj = new Image();
        imageObj.src= ('https://www.themoviedb.org/t/p/w600_and_h900_bestv2/'+ data.get(String(n)).get('id') +'.jpg');
    };
};

function timeout(){
    result(num,'incorrect');
};

function timer_change(){
    timer.style.display='inline-block';
    m= String(~~(x/60));
    s= String((x%60));
    if(s.length==1){s=('0'+s)};
    timer.innerHTML = (String(m)+' : '+String(s));
    if(x>30){c='green'} else if(x>10){c='orange'} else{c='red'};
    timer.style.backgroundColor = c;
    x=x-1;
    var c='green'
};

function enter_mcq_value(n){
    var objets = [answer1, answer2, answer3, answer4]
    mcq_value = objets[n-1].value;
    verification();
};


//autocomplete input algorithme
input.onkeyup = function(){
value = input.value.toLowerCase();
if (value.length > 0){
    valide_button.disabled = false;
    var options = '';
    var sup = [];
    var suggestions_copy = suggestions.slice();
    var o=0;
    for(var i = 0; i < suggestions.length; i++){
        m=suggestions[i].toLowerCase();
        c=value.length;
        if(m.slice(0,c)==value){options += '<option value="' + m + '" />'; suggestions_copy.splice(i,1); o+=1}
        else if(m.indexOf(value)>-1){sup.push(m)};
        if(o>4){return datalist.innerHTML = options};
    };
    for(var i = 0; i < sup.length; i++){
        m=sup[i];
        options += '<option value="' + m + '" />';
        o+=1
        if(o>4){return datalist.innerHTML = options};
    };
    return datalist.innerHTML = options
    
}
else {valide_button.disabled = true;};
};


//touches raccourcis
addEventListener("keyup", function(event){
    if (event.keyCode === 13 & input.value.length > 0) {verification();}
});
addEventListener("keyup", function(event){
    if ((event.keyCode === 39 || event.keyCode === 32) & bloc_results.style.display == "block") {next();}
});

function home(){
    if(ntrack >= 0){var language = selectlang.value; var msg = config_language.get('confirm').get(language); conf= confirm(msg)}
    else{var conf = 1;};
    if(conf){location.reload();};
};

function init(){
    bloc_menu.style.display = "block";
    bloc_config1.style.display = "block";
    bloc_config2.style.display = "none";
    bloc_game.style.display = "none";
    bloc_end.style.display = "none";
    
    mode = '';
    x = 0;
    nb_movies = 0;
    num = 0;
    ntrack = 0;
    tracklist = [];
    suggestions = [];
    musique = new Audio();
    score = 0;
    out = 0;
    t = 0;
    mcq_value = '';
};

function check_resolution(){
    if(screen.width<=1000){alert('The resolution of your device is not sufficient for an optimal display.\nWe are currently working on a mobile version of the website.')};
};

var mode = '';
var x = 0;
var nb_movies = 0;
var num = 0;
var ntrack = 0;
var tracklist = [];
var suggestions = [];
var musique = new Audio();
var score = 0;
var out = 0;
var t = 0;
var mcq_value = '';
init();
setTimeout(check_resolution, 1000);

//https://www.zdnet.fr/actualites/javascript-precharger-les-images-pour-accelerer-l-affichage-39155708.htm?p=2