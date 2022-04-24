// Gets URL param values
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

let effect = getUrlParameter('effect').toLowerCase().trim();

let emoteSize = getUrlParameter('emoteSize') ? getUrlParameter('emoteSize') : '1';

let channelName = getUrlParameter('channel').toLowerCase().trim();

let command = getUrlParameter('command').toLowerCase().trim();

let limit = getUrlParameter('limit') ? parseInt(getUrlParameter('limit')) : 20;

let emotes = getUrlParameter('emotes') ? getUrlParameter('emotes') : '25';

let repeat = getUrlParameter('repeat') ? parseInt(getUrlParameter('repeat')) : 1;

let randomSize = getUrlParameter('randomSize').toLowerCase().trim();

let repeatSpeed = getUrlParameter('repeatSpeed') ? parseInt(getUrlParameter('repeatSpeed')) * 1000 : 1000;

let duration = getUrlParameter('duration') ? parseInt(getUrlParameter('duration')) * 1000 : 1000;

let speed = getUrlParameter('speed').toLowerCase().trim() ? getUrlParameter('speed').toLowerCase().trim() : '3';

let eventsArray = ['raided', 'hosted', 'subscription', 'resub', 'subgift', 'cheer'];

let userEmotes = getUrlParameter('userEmotes').toLowerCase().trim();

if (!randomSize) {
    randomSize = "false"; // Default value
}

if (!effect) {
    alert('effect is not set in the URL');
}

if (!channelName) {
    alert('channel is not set in the URL');
}

// Get random number between min and max value
function rand(min, max) {
    return Math.floor(Math.random() * (max + 1)) + min;
}

// Array Shuffle (randomly order lists)
function shuffleArr(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }
}

// Twitch API: Get User emotes
let getUserEmotes = function (username, callback) {
    let urlU = "https://twitchapi.teklynk.com/getuseremotes.php?channel=" + username;
    let xhrU = new XMLHttpRequest();
    xhrU.open("GET", urlU);
    xhrU.onreadystatechange = function () {
        if (xhrU.readyState === 4) {
            callback(JSON.parse(xhrU.responseText));
            return true;
        } else {
            return false;
        }
    };
    xhrU.send();
};