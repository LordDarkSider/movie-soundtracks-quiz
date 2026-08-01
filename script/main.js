let setup = document.getElementById('setup');
let game = document.getElementById('game');
let selectlang = document.getElementById('selectlang');
let flag = document.getElementById('flag');
let info_game = document.getElementById('info_game');
let btn_start = document.getElementById('btn_start');
let mcq_block = document.getElementById('mcq');
let timer = document.getElementById('timer');

var selection = {};
var draw = null;
var newt_draw = null;
var player_ready = false;
var player = null;
var next_player = null;


// Reusable Promise to wait event
const wait_true = (variableCallback, intervalle = 100) => {
    return new Promise((resolve) => {
        const verif = setInterval(() => {
            if (variableCallback()) {
                clearInterval(verif);
                resolve();
            }
        }, intervalle);
    });
};


// Check if new game has been requested
let args = location.search.substring(1).split("&")
if(args[0].startsWith("gamemode") && 
   args[1].startsWith("scoremode") && 
   args[2].startsWith("sdtracktype") && 
   args[3].startsWith("lang")
) {
    var gamemode = args[0].substring(9);
    var scoremode = args[1].substring(10);
    var sdtracktype = args[2].substring(12);
    var lang = args[3].substring(5);
    if(
        ['mcq', 'title'].includes(gamemode) && 
        ['10movies', '20movies', 'agnstclock'].includes(scoremode) && 
        ['maintheme', 'random'].includes(sdtracktype) &&
        ['en-US', 'fr', 'es', 'de'].includes(lang)
    ) {
        info_game.textContent = "Preparing game...";
        game.style.display = "block";
        random_selection();
    }
    else {
        setup.style.display = "block";
    }
}
else {
    setup.style.display = "block";
}


function random_selection(){
    let nb_movies = 0;
    if(scoremode == "10movies"){
        nb_movies = (gamemode == "mcq") ? 50 : 10;
    }
    else if(scoremode == "20movies"){
        nb_movies = (gamemode == "mcq") ? 100 : 20;
    }

    // Loading data LOCAL TEST (change to JSON request for deployment)
    let script = document.createElement('script');
    script.src = "data/movies_data.js";
    script.type = 'text/javascript';
    script.onload = function() {
        let values = Object.values(data);
        selection = values.sort(() => Math.random() - 0.5).slice(0, nb_movies);
        prepare_game();
    };
    document.head.appendChild(script);
}


// Draw random items from selection and remove the first
function random_draw(nb_items){
    [...selection].sort(() => 0.5 - Math.random()); //shuffle
    let draw = selection.slice(0, nb_items);
    selection.shift();
    return draw;
}


async function prepare_game() {
    await wait_true(() => ytb_api_ready);
    
    draw = random_draw((gamemode == "mcq") ? 5 : 1);

    let first_response = draw[0]
    
    player = create_YTBplayer(first_response['main-theme'], first_response.start);
    await wait_true(() => player_ready);

    info_game.style.display = "none";
    btn_start.style.display = "inline-block";
}


function start_game(){
    btn_start.style.display = "none";
    generate_mcq();
    info_game.textContent = "Guess the movie";
    info_game.style.display = "block";
    mcq_block.style.display = "block";
    play_music();
    start_timer(30, null);
}


function play_music(){
    player.mute();
    player.playVideo();
    setTimeout(() => {
        player.unMute();
        player.setVolume(100);
    }, 300);
}


function create_YTBplayer(videoId, timeStart) {
    let player = new YT.Player('player', {
        videoId: videoId,
        playerVars: {autoplay: 0, controls: 0, playsinline: 1, start: timeStart},
        events: {onReady: () => {player_ready = true;}}
    });
    return player;
}


function generate_mcq(){
    rdm = Array.from({ length: draw.length }, (_, i) => i);
    rdm.sort(() => 0.5 - Math.random());
    rdm.forEach((idx) => {
        movie = draw[idx];
        btn_mcq = document.createElement('button');
        btn_mcq.className = "button btn_mcq";
        btn_mcq.textContent = movie.title[lang];
        mcq_block.appendChild(btn_mcq);
    });
}


function start_timer(duree, callback){
    var t = duree;
    var loop = setInterval(frame, 50);
    timer.innerHTML = duree;
    timer.style.backgroundColor = "rgb(0, 255, 0)"
    timer.style.display = "block";
    function frame() {
        if (t <= 0) {
            clearInterval(loop);
            timer.style.display = "none";
            callback();
        } else {
            t-=0.05;
            r = Math.floor(255 * (1 - t/duree));
            g = Math.floor(255 * t/duree);
            timer.style.backgroundColor = `rgb(${r}, ${g}, 0)`;
            timer.style.width = t/duree*100 + "%";
            timer.innerHTML = Math.ceil(t);
        }
    }
}


function change_language(){
    var language = selectlang.value;
    flag.src = config_language.get('flagsrc').get(language);
};