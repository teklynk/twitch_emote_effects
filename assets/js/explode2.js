$(document).ready(function () {

    // On click event listener - for testing
    $('body').on('click', function () {
        doEffect(effect);
    });



    function doEffect(effect) {
        if (effect === 'explode' || effect === 'explode2') {
            let alertCustomStyles;

            let style = document.createElement('style');

            style.type = 'text/css';

            if (effect === 'explode2') {
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