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

if (!randomSize) {
    randomSize = "false"; // Default value
}

if (!effect) {
    alert('effect is not set in the URL');
}

if (!channelName) {
    alert('channel is not set in the URL');
}

// TMIJS
const client = new tmi.Client({
    options: {debug: true},
    connection: {
        reconnect: true,
        secure: true,
    },
    channels: [channelName]
});

client.connect().catch(console.error);

// Triggers on message
client.on('chat', (channel, user, message, self) => {

    // Ignore echoed messages.
    if (self) {
        return false;
    }

    let chatmessage = message.replace(/(<([^>]+)>)/ig, "");

    // Alert message - Mods only
    if (user['message-type'] === 'chat' && client.isMod(channelName, user.username) || user.username === channelName) {
        // Check if command is not an event
        if (eventsArray.indexOf(command) === -1) {
            if (chatmessage.startsWith("!" + command)) {
                doEffect(effect);
            }
        }

    }
});

// Events
switch (command) {
    case 'raided':
        client.on("raided", (channel, username, viewers) => {
            doEffect();
        });
        break;
    case 'hosted':
        client.on("hosted", (channel, username, viewers, autohost) => {
            doEffect(effect);
        });
        break;
    case 'cheer':
        client.on("cheer", (channel, userstate, message) => {
            doEffect();
        });
        break;
    case 'subscription':
        client.on("subscription", (channel, username, method, message, userstate) => {
            doEffect();
        });
        break;
    case 'resub':
        client.on("resub", (channel, username, months, message, userstate, methods) => {
            doEffect();
        });
        break;
    case 'subgift':
        client.on("subgift", (channel, username, months, message, userstate, methods) => {
            doEffect();
        });
        break;
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



