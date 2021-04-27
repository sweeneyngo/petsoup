module.exports = {
  name: "pet",
  description: "Provides GIF formatted data of image with petpet animation.",
  args: true,
  usage: "[URL]",
  execute(message, args) {
    (async function pet() {
      message.channel.send("Flags:" + args);

      // Check for image extensions
      const ext = [".png", ".gif", ".jpg", ".jpeg"];
      if (
        args[0].length < 4 &&
        !ext.includes(args[0].substr(args[0].indexOf(".")))
      ) {
        message.channel.send(
          `um... ${message.author}? i don't think that was an image...`
        );
        return;
      }

      let mods = {
        delay: 1,
        squish: 1,
      };

      // Flag modifications
      let delayQueue = [];
      let squishQueue = [];
      if (args.includes("-f")) delayQueue.push(0.75);
      if (args.includes("-ff")) delayQueue.push(0.5);
      if (args.includes("-fff")) delayQueue.push(0.25);
      if (args.includes("-s")) delayQueue.push(1.25);
      if (args.includes("-ss")) delayQueue.push(1.5);
      if (args.includes("-sss")) delayQueue.push(1.75);
      if (args.includes("-q")) squishQueue.push(0.95);
      if (args.includes("-qq")) squishQueue.push(0.85);
      if (args.includes("-qqq")) squishQueue.push(0.8);

      if (delayQueue > 0) mods.delay = delayQueue[0];
      if (squishQueue > 0) mods.squish = squishQueue[0];

      const URL = args[0];

      const { MessageAttachment } = require("discord.js");
      const { createCanvas, loadImage } = require("canvas");
      const GIFEncoder = require(`gifencoder`);

      let sqh = [0, 0.1, 0.2, 0.3, 0.2, 0.05].map((px) => px * mods.squish);
      let sqw = [0, 0.05, 0.1, 0.15, 0.1, 0].map((px) => px * mods.squish);

      let bh = [1, 0.955, 0.85, 0.7, 0.8, 0.95];
      let bw = [1, 1.05, 1.1, 1.2, 1.15, 1.05];

      let bounceHeight = [];
      let bounceWidth = [];

      for (let i = 0; i < bh.length; i++) bounceHeight.push(bh[i] - sqh[i]);
      for (let i = 0; i < bw.length; i++) bounceWidth.push(bw[i] + sqw[i]);

      if (mods.squish === 1) {
        bounceHeight = bh;
        bounceWidth = bw;
      }

      if (mods.squish === 1)
        handBounceHeight = [1, 0.985, 0.975, 0.97, 0.985, 1];
      // perfect for default
      else if (mods.squish === 0.95)
        handBounceHeight = [1, 0.95, 0.92, 0.9, 0.94, 1];
      // perfect for q
      else if (mods.squish === 0.85)
        handBounceHeight = [1, 0.95, 0.9, 0.775, 0.85, 1];
      // perfect for qq
      else if (mods.squish === 0.8)
        handBounceHeight = [1, 0.95, 0.8, 0.7, 0.85, 1]; // perfect for qqq

      console.log(bounceHeight);
      console.log(bounceWidth);

      const HAND_HEIGHT_OFFSET = 8;
      const CANVAS_HEIGHT = 112;
      const CANVAS_WIDTH = 112;
      const FRAME_WIDTH = CANVAS_WIDTH * 0.8; // 0.7, 0.925
      const FRAME_HEIGHT = CANVAS_HEIGHT * 0.9; // 0.925
      const HAND_WIDTH = CANVAS_WIDTH * 0.95; // old: 0.775,
      const HAND_HEIGHT = CANVAS_HEIGHT * 0.95; // old: 0.725,

      const QUALITY = 20; // image quality. 10 is default (1-30)
      const DELAY = 60 * mods.delay;

      let urlsToLoad = [
        `${__dirname}/../sprite1.png`,
        `${__dirname}/../sprite2.png`,
        `${__dirname}/../sprite3.png`,
        `${__dirname}/../sprite4.png`,
        `${__dirname}/../sprite5.png`,
      ];

      let img;
      try {
        img = await loadImage(URL);
      } catch (err) {
        console.log(err);
        if (err.code === "ENOENT") {
          message.channel.send(
            `${message.author}, i can't find it anywhere... m-maybe you mistyped it?`
          );
        }

        return;
      }

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
          0,
          0,
          img.width,
          img.height * 0.6,
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
            HAND_HEIGHT * handBounceHeight[i] +
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
