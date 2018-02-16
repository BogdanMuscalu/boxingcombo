/* main javascript file */

// define global variables
var oldPlayers;
var comboInterval;
var strikeTimerArray = [];
var currentAudio = new Audio();

// negative duration between playback of audio files inside a combo
var shortenPlayback = 80;

// the array of audio durations, starting at index 1
var durationsArray = [0, 365.714, 391.837, 365.714, 417.959, 470.204, 548.571, 574.694, 391.837, 731.429, 679.184, 653.061, 731.429, 600.816];
// build audios array, starting at index 1
var audiosArray = [0];
for ( var i = 1; i <= 13; i++ ) {
    audiosArray.push( new Audio( 'assets/audio/' + i.toString() + '.mp3' ) );
}

// initial player setting if not found in local storage
var players = "2";
// get the setting out of local storage if possible
if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('comboPlayers')) {
        players = localStorage.getItem('comboPlayers');
    }
}
// use the setting from local storage
setPlayers(players);

// implements a new setting and saves it
function setPlayers(playerString) {
    // only do something if the setting is changed
    if (playerString !== oldPlayers) {

        if (playerString === "1") {

            $("#onePlayer").addClass('selected');
            $("#twoPlayers").removeClass('selected');
            $(".less").hide();
            $(".more").show();
            $(".less").last().next().css("margin-top", "0");

        } else {

            $("#onePlayer").removeClass('selected');
            $("#twoPlayers").addClass('selected');
            $(".less").show();
            $(".more").hide();
            $(".less").last().next().css("margin-top", "8px");
        }
        // save the new setting
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('comboPlayers', playerString);
        }

        oldPlayers = playerString;
    }
}

// creates an array of strikes
function createCombo() {

    var outputArray = [];

    // choose algorithm depending on setting
    if (players === "2") {

        outputArray.push(Math.ceil(Math.random() * 4) * 2 - 1);
        outputArray.push(Math.ceil(Math.random() * 4) * 2);

    } else {

        outputArray.push(Math.ceil(Math.random() * 2) * 2 - 1);
        outputArray.push(Math.ceil(Math.random() * 4) * 2);
        outputArray.push(Math.ceil(Math.random() * 3) * 2 + 1);

        if (Math.floor(Math.random() * 2)) {
            outputArray.push(Math.ceil(Math.random() * 4) * 2);
        }

        outputArray.push(Math.ceil(Math.random() * 5) + 8);
    }

    return outputArray;
}

// plays an array of strikes
function playCombo(comboArray) {

    var delay = 0;

    // loop through the array
    comboArray.forEach(function (value, index) {
        // enqueue all audio files according to their duration
        // put them in an array for an easy clearInterval to stop playing
        strikeTimerArray.push( setTimeout(function() {
            audiosArray[value].play();
            currentAudio = audiosArray[value];
        }, delay - (shortenPlayback * index)) );

        // increment the delay according to audio file duration
        delay += durationsArray[value];
    });
}

// stop playing audio, clear all intervals
function stopPlaying() {

    // pause and reset current audio
    currentAudio.pause();
    currentAudio.currentTime = 0;

    // stop the current combo
    strikeTimerArray.forEach(function (strikeTimer) {
        clearInterval(strikeTimer);
    });

    // stop future combos
    clearInterval(comboInterval);

    // clear the timers array so it won't get cluttered
    strikeTimerArray = [];
}
