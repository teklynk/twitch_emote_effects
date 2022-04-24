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

    function get_random_size(list) {
        list = list.replace(/,\s*$/, ""); // remove last character
        let listArray = list.split(',');
        let ListItem = Math.floor(Math.random() * listArray.length + 1);
        return ListItem.toString();
    }

    function get_random_emotes(list) {
        list = list.replace(/,\s*$/, ""); // remove last character
        let listArray = list.split(',');
        let randNum = Math.floor(Math.random() * listArray.length);
        return listArray[randNum];
    }

    function showUserEmotes(getUserName) {
        getUserEmotes(getUserName, function (userinfo) {
            if (userinfo.data.length > '') {

                $.each(userinfo.data, function (i, uEmote) {
                    emotes += ',' + uEmote.id ;
                });

                return emotes = emotes.replace(/,\s*$/, ""); // remove last character

            }
        });
    }

    function doEffect(username) {

        if (userEmotes === 'true' && username) {
            showUserEmotes(username);
        }

        let emoteElement;
        let emoteImg;

        let sizeOptions;

        for (let i = 0; i < limit; i++) {

            emoteImg = document.createElement("div");
            $(emoteImg).addClass('particle_bg');

            if (randomSize === "true") {
                sizeOptions = get_random_size("1,2,3");

                if (sizeOptions === "1") {
                    $(emoteImg).addClass('rnd_small');
                } else if (sizeOptions === "2") {
                    $(emoteImg).addClass('rnd_med');
                } else if (sizeOptions === "3") {
                    $(emoteImg).addClass('rnd_lg');
                }

            } else {
                sizeOptions = emoteSize;
            }

            // add these css class names to each emote size
            if (sizeOptions === "1") {
                $(emoteImg).addClass('small');
            } else if (sizeOptions === "2") {
                $(emoteImg).addClass('med');
            } else if (sizeOptions === "3") {
                $(emoteImg).addClass('lg');
            }

            emoteElement = document.createElement("div");
            $(emoteElement).addClass('particle');
            $(emoteElement).prop('id', 'particle_' + i);

            emoteElement.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
            emoteElement.style.animationDuration = parseInt(speed) + Math.random() * 0.3 + "s";
            emoteElement.style.animationDelay = Math.random() * 5 + "s";
            emoteImg.style.animation = "wobble " + rand(3, 6) + "s alternate ease-in-out infinite";

            emoteImg.style.background = "transparent url('https://static-cdn.jtvnw.net/emoticons/v2/" + get_random_emotes(emotes) + "/default/dark/" + sizeOptions + ".0') no-repeat center center";

            document.getElementById('container').append(emoteElement);
            document.getElementById('particle_' + i).appendChild(emoteImg);

            // Randomly fade out each emote. All emotes are removed after duration time completes
            setTimeout(function () {
                $('#particle_' + i).fadeOut(1500, function () {
                    $(this).remove();
                });
            }, rand(duration / 2, duration)); // min, max
        }

    }
});