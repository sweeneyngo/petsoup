## petsoup
 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Code style: airbnb](https://img.shields.io/badge/code%20style-airbnb-lightgrey)](https://airbnb.io/javascript/)
 
petsoup fetches + renders an in-line GIF of the ![PETTHE](https://knowyourmeme.com/memes/pet-the-x-petthe-emotes)/![petpet](https://benisland.neocities.org/petpet/) emote.

## Purpose
<sub>all you have to do is to squish that cat.</sub>

<img align="right" height="140" width="140" src=https://media.discordapp.net/attachments/833450081247952899/836735743358795816/pet.gif?width=75&height=75>

I've followed the template from different Twitch streams to apps like Discord, and it's an adorable addition to the collection of emotes/memes. However, despite its
presence on these applications, there was no stable in-line renderer to automatically create these GIFs, aside from the collection of generators online. When it comes to adorable emojis,
time was precious.

## Installation

Requires Node for discord.js to function properly*:
(* Use appropriate package manager for Linux/Mac machines, download [here](https://nodejs.org/en/download/) for Windows).

```bash
node -v
```

## Goals

- Add more flags for fine-tuning like squish, speed, image size
- Implement filetype support + compatibility with Discord's file-sharing system.
- Optimize canvas resizing/cropping.


## Contributing
Pull requests are always welcome! Any major changes you wish to implement should first be initiated with an issue + pull request (updating tests as necessary).

## Major Technologies
- [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## License
[MIT](https://choosealicense.com/licenses/mit/)
