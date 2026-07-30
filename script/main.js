let setup = document.getElementById('setup');
let game = document.getElementById('game');
let selectlang = document.getElementById('selectlang');
let flag = document.getElementById('flag');
let peparing_info = document.getElementById('prepa_game');

var selection = {};
var player_ready = false;


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
        ['en', 'fr', 'es', 'de'].includes(lang)
    ) {
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
    
    let draw = random_draw((gamemode == "mcq") ? 5 : 1);
    console.log(draw);

    let first_response = draw[0]
    
    let player = create_YTBplayer(first_response['main-theme'], first_response.start);
    await wait_true(() => player_ready);

    player.mute();
    player.playVideo();
    setTimeout(() => {
        player.unMute();
        player.setVolume(100);
    }, 300);
}


function create_YTBplayer(videoId, timeStart) {
    let player = new YT.Player('player', {
        videoId: 'r0sICC8CxRQ',
        playerVars: {autoplay: 0, controls: 0, playsinline: 1, start: 0},
        events: {onReady: () => {alert('ok');}}
    });
    return player;
}


function change_language(){
    var language = selectlang.value;
    flag.src = config_language.get('flagsrc').get(language);
};