$(document).ready(function () {
    // Gets URL param values
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    let limit = getUrlParameter('limit') ? parseInt(getUrlParameter('limit')) : 20;

    let emotes = getUrlParameter('emotes') ? getUrlParameter('emotes') : '555555560';

    let repeat = getUrlParameter('repeat') ? parseInt(getUrlParameter('repeat')) : 1;

    let repeatSpeed = getUrlParameter('repeatSpeed') ? parseInt(getUrlParameter('repeatSpeed')) * 1000 : 1000;

    let emoteSize = getUrlParameter('emoteSize') ? getUrlParameter('emoteSize') : '1';

    let channelName = getUrlParameter('channel').toLowerCase().trim();

    let command = getUrlParameter('command').toLowerCase().trim();

    let effect = getUrlParameter('effect').toLowerCase().trim();

    let speed = getUrlParameter('speed').toLowerCase().trim() ? getUrlParameter('speed').toLowerCase().trim() : '4';

    if (!effect) {
        alert('effect is not set in the URL');
    }

    if (!channelName) {
        alert('channel is not set in the URL');
    }

    let eventsArray = ['raided', 'hosted', 'subscription', 'resub', 'subgift', 'cheer'];

    function get_random (list) {
        return list[Math.floor((Math.random()*list.length))];
    }

    // On click event listener - for testing
    $('body').on('click', function () {
        doEffect(effect);
    });

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

    function doEffect() {

        let emoteElement;
        let emoteImg;
        let counter = 100;
        let emotesArray = emotes.split(',');
        let randomSize = "1,2,3";

        for (let i = 0; i < counter; i++) {
            emoteElement = document.createElement("div");
            $(emoteElement).addClass('particle');
            $(emoteElement).prop('id', 'particle_' + i);

            emoteImg = document.createElement("div");
            $(emoteImg).addClass('particle_bg');

            emoteElement.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
            emoteElement.style.animationDuration = 1.5 + Math.random() * 0.3 + "s";
            emoteElement.style.animationDelay = Math.random() * 5 + "s";

            emoteImg.style.background = "transparent url('https://static-cdn.jtvnw.net/emoticons/v2/" + get_random(emotesArray) + "/default/dark/" + get_random(randomSize) +".0') no-repeat center center";

            document.getElementById('container').append(emoteElement);
            document.getElementById('particle_' + i).appendChild(emoteImg);
        }
    }
});