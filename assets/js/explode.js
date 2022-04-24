$(document).ready(function () {

    // On click event listener - for testing
    $('body').on('click', function () {
        doEffect();
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
                    doEffect(user.username);
                }
            }

        }
    });

    // Events
    switch (command) {
        case 'raided':
            client.on("raided", (channel, username, viewers) => {
                doEffect(username);
            });
            break;
        case 'hosted':
            client.on("hosted", (channel, username, viewers, autohost) => {
                doEffect(username);
            });
            break;
        case 'cheer':
            client.on("cheer", (channel, userstate, message) => {
                doEffect(null);
            });
            break;
        case 'subscription':
            client.on("subscription", (channel, username, method, message, userstate) => {
                doEffect(username);
            });
            break;
        case 'resub':
            client.on("resub", (channel, username, months, message, userstate, methods) => {
                doEffect(username);
            });
            break;
        case 'subgift':
            client.on("subgift", (channel, username, months, message, userstate, methods) => {
                doEffect(username);
            });
            break;
    }

    function doEffect(effect) {
        if (effect === 'explode') {
            let alertCustomStyles;

            let style = document.createElement('style');

            style.type = 'text/css';

            if (effect === 'explode') {
                alertCustomStyles = '.explosion .particle {\
                    animation: grow ' + parseInt(speed) + 's ease-in-out, out ' + parseInt(speed) + 's reverse forwards;\
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

        // remove last character
        emotes = emotes.replace(/,\s*$/, "");

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