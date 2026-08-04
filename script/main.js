let setup = document.getElementById('setup');
let game = document.getElementById('game');
let selectlang = document.getElementById('selectlang');
let flag = document.getElementById('flag');
let info_game = document.getElementById('info_game');
let btn_play = document.getElementById('btn_play');
let mcq_block = document.getElementById('mcq');
let timer = document.getElementById('timer');
let poster = document.getElementById('poster');
let poster_img = document.getElementById('poster_img');
let score_info = document.getElementById('score_info');
let score_value = document.getElementById('score_value');

const mcq_duree = 30;
var selection = {};
var draw = null;
var next_draw = null;
var player_ready = false;
var player = null;
var next_player = null;
var playing = false;
var t = 0;
var total_score = 0;
var nb_tracks = 0;
var nb_tt_tracks = 0;


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

    if(scoremode=="10movies") nb_tt_tracks = 10;
    else if(scoremode=="20movies") nb_tt_tracks = 20;
    
    next_draw = random_draw((gamemode == "mcq") ? 5 : 1);

    let first_response = next_draw[0];
    
    next_player = create_YTBplayer(first_response['main-theme'], first_response.start);
    await wait_true(() => player_ready);

    info_game.style.display = "none";
    btn_play.style.display = "inline-block";
}


// Start the first track but also the following tracks
function play_game(){
    if(nb_tracks != 0){
        player.pauseVideo();   // Stop the previous track
        document.getElementById('player'+nb_tracks).remove();   // Remove player
    }
    
    if(scoremode == "agnstclock" || nb_tracks < nb_tt_tracks){
        // Shift the variables
        draw = next_draw;
        player = next_player;
    }
    else return endgame();

    btn_play.style.display = "none";
    poster.style.display = "none";
    score_info.style.display = "none";
    //game.style.minWidth= '30vw';

    // Prepare the poster
    poster_img.src = "https://www.themoviedb.org/t/p/w1280" + draw[0].poster[lang];
    poster_img.alt = draw[0].title[lang];
    poster_img.title = draw[0].title[lang];
    
    if(gamemode == 'mcq') generate_mcq();
    info_game.textContent = "Guess the movie";
    info_game.style.color = "white";
    info_game.style.display = "block";
    if(gamemode == 'mcq') mcq_block.style.display = "block";
    
    nb_tracks += 1;
    playing = true;
    play_music();
    if(gamemode == 'mcq') start_timer(mcq_duree);

    // Prepare the next track
    if(scoremode == "agnstclock" || nb_tracks < nb_tt_tracks){
        next_draw = random_draw((gamemode == "mcq") ? 5 : 1);
        let first_response = next_draw[0];
        player_ready = false;
        next_player = create_YTBplayer(first_response['main-theme'], first_response.start);
    }
}


function play_music(){
    player.mute();
    player.playVideo();
    setTimeout(() => {
        player.unMute();
        player.setVolume(100);
    }, 100);
}


function create_YTBplayer(videoId, timeStart) {
    const player_div = document.createElement('div');
    let id = "player"+(nb_tracks+1);
    player_div.id = id;
    player_div.className = "player";
    game.appendChild(player_div);
    let player = new YT.Player(id, {
        videoId: videoId,
        playerVars: {autoplay: 0, controls: 0, playsinline: 1, start: timeStart},
        events: {onReady: () => {player_ready = true}}
    });
    return player;
}


function generate_mcq(){
    mcq_block.innerHTML = ""; // delete old buttons
    rdm = Array.from({ length: draw.length }, (_, i) => i);
    rdm.sort(() => 0.5 - Math.random());
    rdm.forEach((idx) => {
        const movie = draw[idx];
        const btn_mcq = document.createElement('button');
        btn_mcq.className = "button btn_mcq";
        btn_mcq.textContent = movie.title[lang];
        btn_mcq.addEventListener("click", () => result(movie.title[lang]));
        mcq_block.appendChild(btn_mcq);
    });
}


function start_timer(duree){
    t = duree;
    var loop = setInterval(frame, 50);
    timer.innerHTML = duree;
    timer.style.backgroundColor = "rgb(0, 255, 0)";
    timer.style.display = "block";
    function frame() {
        if (!playing){
            clearInterval(loop);
        }
        else if (t <= 0) {
            return result(null);
        }
        else {
            t-=0.05;
            r = Math.floor(255 * (1 - t/duree));
            g = Math.floor(255 * t/duree);
            timer.style.backgroundColor = `rgb(${r}, ${g}, 0)`;
            timer.style.width = t/duree*100 + "%";
            timer.innerHTML = Math.ceil(t);
        }
    }
}


async function result(answer){
    const time_remaining = t;
    playing = false;
    timer.style.display = "none";
    if(gamemode == 'mcq') mcq_block.style.display = "none";

    const correct = Object.values(draw[0].title).includes(answer);

    if(correct){
        info_game.textContent = "CORRECT";
        info_game.style.color = "rgb(0, 200, 0)";
    }
    else {
        info_game.textContent = "INCORRECT";
        info_game.style.color = "rgb(255, 0, 0)";
    }

    poster.style.display = "block";
    score_value.innerHTML = total_score;
    score_info.style.display = "inline-block";

    if(correct){
        const score = (scoremode == 'agnstclock') ? 100 : (50 + Math.ceil(t/mcq_duree * 50));
        total_score += score;
        // Score increment animation
        const interval = setInterval(() => {
            let val = parseInt(score_value.innerHTML);
            val += 1;
            score_value.innerHTML = val;
            if (val == total_score) {clearInterval(interval);}
        }, 10);
    }

    await wait_true(() => player_ready);
    btn_play.innerHTML = "NEXT";
    btn_play.style.display = "inline-block";
}


function change_language(){
    var language = selectlang.value;
    flag.src = config_language.get('flagsrc').get(language);
};