const setup_block = document.getElementById('setup');
const game_block = document.getElementById('game');
const endgame_block = document.getElementById('endgame');
const btn_home = document.getElementById('btn_home');
const selectlang = document.getElementById('selectlang');
const flag = document.getElementById('flag');
const info_game = document.getElementById('info_game');
const btn_play = document.getElementById('btn_play');
const btn_replay = document.getElementById('btn_replay');
const mcq_block = document.getElementById('mcq');
const title_block = document.getElementById('entry_title');
const movie_title = document.getElementById('movie_title');
const suggestions_list = document.getElementById('suggestions');
const btn_valid_title = document.getElementById('btn_valid_title');
const progression = document.getElementById('progression');
const timer = document.getElementById('timer');
const poster = document.getElementById('poster');
const poster_img = document.getElementById('poster_img');
const score_info = document.getElementById('score_info');
const score_value = document.getElementById('score_value');
const final_score_value = document.getElementById('final_score_value');
const summary_gamemode = document.getElementById('gamemode');

const timer_duree = 30;
var lives = 3;
var selection = {};
var draw = null;
var next_draw = null;
var player_ready = false;
var player = null;
var next_player = null;
var playing = false;
var endtime = 0;
var total_score = 0;
var nb_tracks = 0;
var nb_tt_tracks = 0;
var suggestions = [];


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
try {
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
            ['10movies', '20movies', '3-life'].includes(scoremode) && 
            ['maintheme', 'random'].includes(sdtracktype) &&
            ['en-US', 'fr', 'es', 'de'].includes(lang)
        ) {
            info_game.textContent = "Preparing game...";
            game_block.style.display = "block";
            random_selection();
        }
        else {
            setup_block.style.display = "block";
        }
    }
    else {
        setup_block.style.display = "block";
    }
} catch (error) {setup_block.style.display = "block";}


function random_selection(){
    let nb_movies = 0;
    if(scoremode == "10movies") nb_movies = (gamemode == "mcq") ? 50 : 10;
    else if(scoremode == "20movies") nb_movies = (gamemode == "mcq") ? 100 : 20;
    else nb_movies = 100;    // 3-Life (TODO: extend selection when it's emptied)

    // Loading data LOCAL TEST
    // TODO: change to JSON request for deployment
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
    if(gamemode == "title") suggestions_load();

    if(scoremode=="10movies") nb_tt_tracks = 10;
    else if(scoremode=="20movies") nb_tt_tracks = 20;
    
    next_draw = random_draw((gamemode == "mcq") ? 5 : 1);

    const first_response = next_draw[0];
    const videoId = (sdtracktype == "maintheme") ? first_response['main-theme'] : first_response['playlist-videos'][Math.floor(Math.random() * first_response['playlist-videos'].length)];
    const start = (sdtracktype == "maintheme") ? first_response.start : 0;
    
    await wait_true(() => ytb_api_ready);
    
    next_player = create_YTBplayer(videoId, start);
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
    
    if(scoremode == "3-life" & lives > 0 || nb_tracks < nb_tt_tracks){
        // Shift the variables
        draw = next_draw;
        player = next_player;
    }
    else return endgame();

    btn_play.style.display = "none";
    poster.style.display = "none";
    score_info.style.display = "none";

    // Prepare the poster
    poster_img.src = "https://www.themoviedb.org/t/p/w1280" + draw[0].poster[lang];
    poster_img.alt = draw[0].title[lang];
    poster_img.title = draw[0].title[lang];
    
    if(gamemode == 'mcq') generate_mcq();
    info_game.textContent = "Guess the movie";
    info_game.style.color = "white";
    info_game.style.display = "block";
    if(gamemode == 'mcq') mcq_block.style.display = "block";
    else {
        movie_title.value = "";
        suggestions_list.innerHTML = "";
        title_block.style.display = "block";
        movie_title.focus();
    }

    if(scoremode == '3-life') progression.innerHTML = " ❤️ ".repeat(lives) + " 🤍 ".repeat(3-lives);
    else progression.innerHTML = (nb_tracks+1) + '/' + nb_tt_tracks;
    progression.innerHTML
    progression.style.display = "block";
    
    nb_tracks += 1;
    playing = true;
    play_music();

    // Prepare the next track
    if(scoremode == "3-life" || nb_tracks < nb_tt_tracks){
        next_draw = random_draw((gamemode == "mcq") ? 5 : 1);
        const first_response = next_draw[0];
        const videoId = (sdtracktype == "maintheme") ? first_response['main-theme'] : first_response['playlist-videos'][Math.floor(Math.random() * first_response['playlist-videos'].length)];
        const start = (sdtracktype == "maintheme") ? first_response.start : 0;
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
        start_timer(timer_duree);
    }, 100);
}


function create_YTBplayer(videoId, timeStart) {
    const player_div = document.createElement('div');
    let id = "player"+(nb_tracks+1);
    player_div.id = id;
    player_div.className = "player";
    game_block.appendChild(player_div);
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
    endtime = Date.now() + duree * 1000;
    var loop = setInterval(frame, 50);
    timer.innerHTML = duree;
    timer.style.backgroundColor = "rgb(0, 255, 0)";
    timer.style.display = "block";
    function frame() {
        let t = Date.now();
        if (!playing){
            clearInterval(loop);
        }
        else if (t >= endtime) {
            return result(null);
        }
        else {
            remaining = (endtime - t)/1000;
            r = Math.floor(255 * (1 - remaining/duree));
            g = Math.floor(255 * remaining/duree);
            timer.style.backgroundColor = `rgb(${r}, ${g}, 0)`;
            timer.style.width = remaining/duree*100 + "%";
            timer.innerHTML = Math.ceil(remaining);
        }
    }
}


async function result(answer){
    const time_remaining = (endtime - Date.now()) / 1000;
    playing = false;
    timer.style.display = "none";
    if(gamemode == 'mcq') mcq_block.style.display = "none";
    else title_block.style.display = "none";

    const correct = Object.values(draw[0].title).includes(answer);

    if(correct){
        info_game.textContent = "CORRECT";
        info_game.style.color = "rgb(0, 200, 0)";
    }
    else {
        info_game.textContent = "INCORRECT";
        info_game.style.color = "rgb(255, 0, 0)";
        if(scoremode == '3-life') {
            lives--;
            progression.innerHTML = " ❤️ ".repeat(lives) + " 🤍 ".repeat(3-lives);
        };
    }

    poster.style.display = "block";
    score_value.innerHTML = total_score;
    score_info.style.display = "inline-block";

    if(correct){
        const score = 50 + Math.ceil(time_remaining/timer_duree * 50);
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


function endgame(){
    playing = false;
    game_block.style.display = "none";
    
    final_score_value.innerHTML = total_score;
    summary_gamemode.innerHTML = (
        ((scoremode == '10movies') ? '10 movies' : ((scoremode == '20movies') ? '20 movies' : '3-Life')) +
        ((gamemode == 'mcq') ? ', multiple choice' : ', full title') +
        ((sdtracktype == 'maintheme') ? ', main theme' : ', random')
    );
    endgame_block.style.display = "block";
}


function change_language(){
    var language = selectlang.value;
    flag.src = config_language.get('flagsrc').get(language);
};


function suggestions_load(){
    suggestions = [];
    // TODO: change to JSON request for deployment
    Object.values(data).forEach((movie) => suggestions.push(movie['title'][lang]));
};


// Event buttons clicked
btn_play.addEventListener("click", () => play_game());
btn_replay.addEventListener("click", () => location.reload());
btn_valid_title.addEventListener("click", () => result(movie_title.value));
btn_home.addEventListener("click", () => window.location = window.location.href.split("?")[0]);


// Movie title suggestions
movie_title.addEventListener("keyup", () => {
    const value = movie_title.value.toLowerCase();
    let options = '';
    let additional = [];
    let nb = 0;
    if (value.length >= 2){
        suggestions.forEach((title) => {
            if(title.toLowerCase().startsWith(value)) {
                options += '<option value="'+title+'"/>';
                nb++;
            }
            else if(title.toLowerCase().includes(value)) additional.push(title);
            if(nb==6) return suggestions_list.innerHTML = options;
        })
        for(let i = nb; i < 6; i++){options += '<option value="'+additional.shift()+'"/>';}
    }
    return suggestions_list.innerHTML = options;
});


// Shortcuts
document.addEventListener("keyup", function(event){
    // Next
    if ((event.keyCode === 39 || event.keyCode === 32) & !playing & btn_play.style.display != "none") {play_game();}
    // Valid title
    if ((event.keyCode === 13) & playing & movie_title.style.display != "none") {result(movie_title.value);}
});