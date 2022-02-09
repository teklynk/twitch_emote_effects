# Twitch Emote Effects Overlay

## What is this?

This is a Twitch browser source overlay that displays multiple emotes on screen with an explosion effect, similar to fireworks. This project uses [TMIJS](https://tmijs.com/), javascript, html, css. It is client-side code that can run locally (localhost) or on your own server. 

### [Try it here](https://twitch-emote-effects.pages.dev/)


## Options

**Trigger emotes to fire on events or chat command**

**Animation speed**

**Set the number of emotes to display**

**Set the number of times that the effect happens**

**Set the rate that the effect happens**

**Set the effect speed**

**Choose which emotes to display. You can also search for other emotes by channel name**

**Window size is dynamic (adjusts automatically on refresh)**

## Notes

* Enable OBS browser source hardware acceleration in Settings -> Advanced in OBS.

* Set OBS browser source frame-rate from 30 to 60 FPS.

## URL Parameters

**channel=Your channel name** 

**limit=integer**  Number of emotes to use.

**emotes=string**  Comma separated list of emote id's. emote_id1,emote_id2,emote_id3

**repeat=integer** The number of times that the effect should fire.

**repeatSpeed=integer**  The number of seconds between repeats.

**emoteSize=integer**  Choose from 3 different Twitch emote sizes. 1,2,3 (Small, Medium, Large).

**command=string**  What event should fire off the effect. Defaults are (Raided, Hosted, Cheer, Subscription, Resub). You can also set this as a chat command with example: command=fireworks. Chat would then type: !fireworks to trigger the effect.

**effect=string**  Animation effect to use: explode,explode2

**speed=integer**  Adjust the speed of the effect animation.

## Custom CSS

Add this CSS to the OBS browser source and modify as needed.

```
.explosion {
    position: absolute;
}

.explosion .particle {
    position: absolute;
    width: 112px;
    height: 112px;
    background: transparent;
}
```