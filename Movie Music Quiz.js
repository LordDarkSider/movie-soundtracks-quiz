var images_older = [ 'data/images older/Bell Katie.jpg', 'data/images older/Bellebosse Croyance.jpg', 'data/images older/Bibine Renée.jpg', 'data/images older/Black Sirius.jpg', 'data/images older/Brown Lavande.jpg', 'data/images older/Cattermole Reginald.jpg', 'data/images older/Chang Cho.jpg', 'data/images older/Croupton Bartemius Jr.jpg', 'data/images older/Croupton Bartemius Sr.jpg', 'data/images older/Delacour Fleur.jpg', 'data/images older/Diggory Amos.jpg', 'data/images older/Diggory Cedric.jpg', 'data/images older/Dragonneau Norbert.jpg', 'data/images older/Dragonneau Thésée.jpg', 'data/images older/Dubois Olivier.jpg', 'data/images older/Dursley Dudley.jpg', 'data/images older/Dursley Pétunia.jpg', 'data/images older/Dursley Vernon.jpg', 'data/images older/Finch-Fletchley Justin.jpg', 'data/images older/Finnigan Seamus.jpg', 'data/images older/Fletcher Mondingus.jpg', 'data/images older/Flitwick Filius.jpg', 'data/images older/Fudge Cornelius.jpg', 'data/images older/Goldstein Porpentina.jpg', 'data/images older/Goldstein Queenie.jpg', 'data/images older/Goyle Gregory et Crabbe Vincent.jpg', 'data/images older/Granger Hermione.jpg', 'data/images older/Graves Percival.jpg', 'data/images older/Greyback Fenrir.jpg', 'data/images older/Grindelwald Gellert.jpg', 'data/images older/Jedusor Tom.jpg', 'data/images older/Johnson Angelina.jpg', 'data/images older/Karkaroff Igor.jpg', 'data/images older/Kowalski Jacob.jpg', 'data/images older/Krum Viktor.jpg', 'data/images older/Lestrange Bellatrix.jpg', 'data/images older/Lestrange Leta.jpg', 'data/images older/Lockhart Gilderoy.jpg', 'data/images older/Londubat Neville.jpg', 'data/images older/Lovegood Luna.jpg', 'data/images older/Lovegood Xenophilius.jpg', 'data/images older/Lupin Remus.jpg', 'data/images older/McLaggen Cormac.jpg', 'data/images older/Malefoy Drago.jpg', 'data/images older/Malefoy Lucius.jpg', 'data/images older/Malefoy Narcissa.jpg', 'data/images older/Maugrey Alastor.jpg', 'data/images older/Ombrage Dolores.jpg', 'data/images older/Parkinson Pansy.jpg', 'data/images older/Patil Parvati et Padma.jpg', 'data/images older/Potter Harry.jpg', 'data/images older/Quirrell Quirinus.jpg', 'data/images older/Rogue Severus.jpg', 'data/images older/Rusard Argus.jpg', 'data/images older/Shacklebolt Kingsley.jpg', 'data/images older/Skeeter Rita.jpg', 'data/images older/Slughorn Horace.jpg', 'data/images older/Thomas Dean.jpg', 'data/images older/Trelawney Sibylle.jpg', 'data/images older/Warren Myrtle.jpg', 'data/images older/Weasley Arthur.jpg', 'data/images older/Weasley Fred et George.jpg', 'data/images older/Weasley Ginny.jpg', 'data/images older/Weasley Molly.jpg', 'data/images older/Weasley Percy.jpg', 'data/images older/Weasley Ronald.jpg', 'data/images older/Yaxley Corban.jpg'];
var images_younger = ['data/images younger/Black Sirius.jpg', 'data/images younger/Chourave Pomona.jpg', 'data/images younger/Diggory Amos.jpg', 'data/images younger/Croupton Bartemius Jr.jpg', 'data/images younger/Croupton Bartemius Sr.jpg', 'data/images younger/Dragonneau Norbert.jpg', 'data/images younger/Dragonneau Thésée.jpg', 'data/images younger/Dumbledore Albus.jpg', 'data/images younger/Dursley Pétunia.jpg', 'data/images younger/Dursley Vernon.jpg', 'data/images younger/Fletcher Mondingus.jpg', 'data/images younger/Flitwick Filius.jpg', 'data/images younger/Fudge Cornelius.jpg', 'data/images younger/Goldstein Porpentina.jpg', 'data/images younger/Goldstein Queenie.jpg', 'data/images younger/Grindelwald Gellert.jpg', 'data/images younger/Graves Percival.jpg', 'data/images younger/Greyback Fenrir.jpg', 'data/images younger/Hagrid Rubeus.jpg', 'data/images younger/Hopkrik Mafalda.jpg', 'data/images younger/Jedusor Tom.jpg', 'data/images younger/Karkaroff Igor.jpg', 'data/images younger/Kowalski Jacob.jpg', 'data/images younger/Lestrange Bellatrix.jpg', 'data/images younger/Lockhart Gilderoy.jpg', 'data/images younger/Lovegood Xenophilius.jpg', 'data/images younger/Lupin Remus.jpg', 'data/images younger/Malefoy Lucius.jpg', 'data/images younger/Malefoy Narcissa.jpg', 'data/images younger/Maxime Olympe.jpg', 'data/images younger/McGonagall Minerva.jpg', 'data/images younger/Ollivander Garrick.jpg', 'data/images younger/Ombrage Dolores.jpg', 'data/images younger/Pettigrow Peter.jpg', 'data/images younger/Quirrell Quirinus.jpg', 'data/images younger/Rogue Severus.jpg', 'data/images younger/Runcorn Albert.jpg', 'data/images younger/Rusard Argus.jpg', 'data/images younger/Scrimgeour Rufus.jpg', 'data/images younger/Shacklebolt Kingsley.jpg', 'data/images younger/Slughorn Horace.jpg', 'data/images younger/Thicknesse Pius.jpg', 'data/images younger/Tonks Nymphadora.jpg', 'data/images younger/Tourdesac Bathilda.jpg', 'data/images younger/Trelawney Sibylle.jpg', 'data/images younger/Weasley Arthur.jpg', 'data/images younger/Weasley Molly.jpg', 'data/images younger/Yaxley Corban.jpg'];
var images_older_younger = images_older.concat(images_younger);
var images_selectionnees = [];
var image_noms = [];


let bloc_menu = document.getElementById('menu');
let bloc_general = document.getElementById('bloc_general');
let bloc_image = document.getElementById('bloc_image');
let bloc_question = document.getElementById('bloc_question');
let bloc_resultats = document.getElementById('bloc_resultats');

let start_button = document.getElementById('start_button');
let selection_buttons = document.getElementsByName('selection_age');
let music_optn = document.getElementById('music_optn');
let infos = document.getElementById('nquestion_score');
let image = document.getElementById('image');
let valide_button = document.getElementById('valide_button');
let choix_noms = document.getElementById('choix_noms');
let reponses_button = document.getElementById("reponses_button");
let reponse = document.getElementById("reponse");


var n_question = 0;
var points = 0;
var selection = "older and younger";
var nom_choisi;
var source;
var index;
var musique = new Audio('data/Harry Potter-Hedwigs Theme Remix-DJ AG.mp3');



function initialisation(){
    bloc_menu.style.display = "none";
    bloc_general.style.display = "block";
    bloc_resultats.style.display = "none";
    n_question = 0;
    selection_images();
    if(music_optn.checked == true) {ambiance()};
	suivant();
};

function selection_images(){
    for(var i = 0; i < selection_buttons.length; i++){if(selection_buttons[i].checked){selection = selection_buttons[i].value;}};
    for(var i = 0; i < 21; i++){
        
        if(selection == "older"){index = Math.floor(Math.random()*images_older.length); images_selectionnees.push(images_older[index]); images_older.splice(index,1)};
        
        if(selection == "younger"){index = Math.floor(Math.random()*images_younger.length); images_selectionnees.push(images_younger[index]); images_younger.splice(index,1)};

        if(selection == "older and younger"){index = Math.floor(Math.random()*images_older_younger.length); images_selectionnees.push(images_older_younger[index]); images_older_younger.splice(index,1)};
    };
};


function verification(){
    nom_choisi = choix_noms.value;
    if(
        (source == String('data/images older/'+nom_choisi+'.jpg'))
        || (source == String('data/images younger/'+nom_choisi+'.jpg'))
    )
    {points += 1;};
    if(n_question >= 20){game_over()} else{suivant()};
};

function suivant(){
    n_question += 1;
    infos.innerHTML = "Image " + n_question + '/20';
    choix_noms.value = '';
    source = images_selectionnees[n_question];
    image.src = source;
    if(source.slice(12,17)=='older') {image_noms.push(source.slice(18,-4))}
    else {image_noms.push(source.slice(20,-4))};
    
};

function game_over(){
    bloc_resultats.style.display = "block";
    bloc_question.style.display = "none";
    image.src = '';
    infos.innerHTML =  "Score: " + points + "/20";
    reponses_button.innerHTML = 'Réponses';
    n_question = 0;
};

function reponses(){
    if(n_question < 20){
        n_question += 1;
        if(n_question == 20){reponses_button.innerHTML = 'Retour';} else{reponses_button.innerHTML = 'Suivant';};
        image.src = images_selectionnees[n_question];
        reponse.innerHTML = image_noms[n_question-1];
		reponse.href = "https://harrypotter.fandom.com/fr/wiki/Spécial:Recherche?query=" + image_noms[n_question-1]
    }
    else{location.reload(); window.location.reload();};
    
};

function ambiance(){
    musique.play();
    musique.loop=true;
};

$(function() {
    $('.selectpicker').selectpicker();
    $('pick__lang').selectpicker();
});


bloc_menu.style.display = "block";
bloc_general.style.display = "none";
start_button.addEventListener('click', initialisation);
valide_button.addEventListener('click', verification);
reponses_button.addEventListener('click', reponses);