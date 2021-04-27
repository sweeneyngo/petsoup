module.exports = {
  name: "pet",
  description: "Provides GIF formatted data of image with petpet animation.",
  args: true,
  usage: "[URL]",
  execute(message, args) {
    (async function pet() {
      const { MessageAttachment } = require("discord.js");
      const { createCanvas, loadImage } = require("canvas");
      const GIFEncoder = require(`gifencoder`);

      const bounceHeight = [1, 0.975, 0.925, 0.85, 0.9, 0.95];
      const bounceWidth = [1, 1.05, 1.1, 1.2, 1.15, 1.05];

      const HAND_HEIGHT_OFFSET = 8;
      const CANVAS_HEIGHT = 112;
      const CANVAS_WIDTH = 112;
      const FRAME_WIDTH = CANVAS_WIDTH * 0.925; // 0.7
      const FRAME_HEIGHT = CANVAS_HEIGHT * 0.925;
      const HAND_WIDTH = CANVAS_WIDTH * 0.95; // old: 0.775,
      const HAND_HEIGHT = CANVAS_HEIGHT * 0.95; // old: 0.725,

      const QUALITY = 20; // image quality. 10 is default (1-30)
      const DELAY = 60;

      let urlsToLoad = [
        `${__dirname}/../sprite1.png`,
        `${__dirname}/../sprite2.png`,
        `${__dirname}/../sprite3.png`,
        `${__dirname}/../sprite4.png`,
        `${__dirname}/../sprite5.png`,
      ];

      const img = await loadImage(args[0]);

      let imageElements = [];

      // first create the images and apply the onload method
      for (let i = 0, len = urlsToLoad.length; i < len; i++) {
        let handImage = await loadImage(urlsToLoad[i]);
        imageElements.push(handImage);
      }

      const GIF = new GIFEncoder(CANVAS_WIDTH, CANVAS_HEIGHT);
      GIF.start();
      GIF.setRepeat(0);
      GIF.setDelay(DELAY);
      GIF.setQuality(QUALITY);
      GIF.setTransparent();

      const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT); // 112, 112
      const ctx = canvas.getContext(`2d`);
      for (let i = 0; i < imageElements.length; i++) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // not needed if images are guaranteed opaque

        // draw image frames
        ctx.drawImage(
          img,
          FRAME_WIDTH -
            FRAME_WIDTH * bounceWidth[i] +
            (CANVAS_WIDTH - FRAME_WIDTH),
          FRAME_HEIGHT -
            FRAME_HEIGHT * bounceHeight[i] +
            (CANVAS_HEIGHT - FRAME_HEIGHT),
          FRAME_WIDTH * bounceWidth[i],
          FRAME_HEIGHT * bounceHeight[i]
        ); // stretch image onto canvas (ignoring aspect ratio)

        // draw hand frames
        let hand = imageElements[i];
        ctx.drawImage(
          hand,
          0, // handWidth - handWidth + (canvas.width - handWidth)
          HAND_HEIGHT -
            HAND_HEIGHT +
            (CANVAS_HEIGHT - HAND_HEIGHT) -
            HAND_HEIGHT_OFFSET,
          HAND_WIDTH, // old: frameWidth * 0.9
          HAND_HEIGHT // old: frameWidth * 0.9
        );

        // clean up image artifact noise
        let imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        let threshold = 128; // play with threshold 1- 255
        for (let i = 0; i < imageData.data.length; i += 4) {
          imageData.data[i + 3] = 255 * (imageData.data[i + 3] > threshold);
        }
        ctx.putImageData(imageData, 0, 0);

        GIF.addFrame(ctx);
      }

      GIF.finish();
      let attach = new MessageAttachment(GIF.out.getData(), "pet.gif");
      message.channel.send(`<@${message.author.id}>`);
      message.channel.send(attach);
    })();
  },
};
