$(document).ready(function () {

    // Gets URL param values
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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
                doEffect(effect);
            });
            break;
        case 'hosted':
            client.on("hosted", (channel, username, viewers, autohost) => {
                doEffect(effect);
            });
            break;
        case 'cheer':
            client.on("cheer", (channel, userstate, message) => {
                doEffect(effect);
            });
            break;
        case 'subscription':
            client.on("subscription", (channel, username, method, message, userstate) => {
                doEffect(effect);
            });
            break;
        case 'resub':
            client.on("resub", (channel, username, months, message, userstate, methods) => {
                doEffect(effect);
            });
            break;
        case 'subgift':
            client.on("subgift", (channel, username, months, message, userstate, methods) => {
                doEffect(effect);
            });
            break;
    }


    function doEffect(effect) {
        if (effect === 'explode' || effect === 'explode2') {
            let alertCustomStyles;

            let style = document.createElement('style');

            style.type = 'text/css';

            if (effect === 'explode') {
                alertCustomStyles = '.explosion .particle {\
                    animation: grow ' + parseInt(speed) + 's ease-in-out, out ' + parseInt(speed) + 's reverse forwards;\
                }';
            } else if (effect === 'explode2') {
                alertCustomStyles = '.explosion .particle {\
                    animation: explode2 ' + parseInt(speed) + 's ease-in-out, shrink ' + parseInt(speed) + 's reverse forwards;\
                }';
            }

            style.innerHTML = alertCustomStyles;

            document.getElementsByTagName('head')[0].appendChild(style);

            let explodeTimer = setInterval(explodeCallback, repeatSpeed);

            let explodeTimerCnt = 0;

            explodeCallback();

            function explodeCallback() {
                explodeTimerCnt++;
                explode(rand(1, window.innerWidth - 200), rand(1, window.innerHeight - 200), rand(1, 10000));

                if (explodeTimerCnt === repeat) {
                    explodeTimerCnt = 0;
                    clearTimeout(explodeTimer);
                }
            }
        }
    }

    // Explosion function
    function explode(x, y, rndNum) {
        // Randomly set the spread/blast radius
        let spread = rand(100, 1000);

        // Create the emotes array from the emotes url param
        let emotesArray = emotes.split(',');

        // Randomly shuffle the emotes array on each execution
        shuffleArr(emotesArray);

        // Explosion container and its reference to be able to delete it on animation end
        let explosion = $('<div class="explosion container_' + rndNum + '"></div>');
        $('#container').append(explosion);

        // Position the container
        explosion.css('left', x - explosion.width() / 2);
        explosion.css('top', y - explosion.height() / 2);

        for (let i = 0; i < limit; i++) {
            let elmDivs = '';

            // Positioning x,y of the emotes (little randomized)
            let x = (explosion.width() / 2) + spread * Math.cos(2 * Math.PI * i / rand(limit - 10, limit + 10));
            let y = (explosion.height() / 2) + spread * Math.sin(2 * Math.PI * i / rand(limit - 10, limit + 10));

            emotesArray.forEach(function (itemName, index) {
                index = index + 1;

                // Generate the divs for each emote
                elmDivs += '<div class="particle item_' + index + '_' + rndNum + '" style="background:url(https://static-cdn.jtvnw.net/emoticons/v2/' + itemName + '/default/dark/' + emoteSize + '.0) no-repeat; top: ' + Math.round(y * index) + 'px; left: ' + Math.round(x * index) + 'px;"></div>';

                // Remove divs after animation has completed
                $('.item_' + index + '_' + rndNum).on('animationend', function () {
                    $('.item_' + index + '_' + rndNum).remove();

                    // Wait 1 second before completely removing the container
                    setTimeout(function () {
                        $('.container_' + rndNum).remove();
                    }, 1000);
                });
            });

            explosion.append(elmDivs);

        }
    }

});