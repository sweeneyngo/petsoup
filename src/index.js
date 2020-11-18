// Create GIF code
const GIF = require("../dist/gif.js");

const bounceHeight = [1, 0.975, 0.925, 0.85, 0.9, 0.95];
const bounceWidth = [1, 1.05, 1.1, 1.2, 1.15, 1.05];

function waitForImagesLoaded(imageURLs, callback) {
  let imageElements = [];
  let remaining = imageURLs.length;
  let onEachImageLoad = function () {
    if (--remaining === 0 && callback) {
      callback(imageElements);
    }
  };

  // first create the images and apply the onload method
  for (let i = 0, len = imageURLs.length; i < len; i++) {
    let img = new Image();
    imageElements.push(img);
    img.onload = onEachImageLoad;
    img.src = imageURLs[i];
  }
}

let urlsToLoad = [
  "../src/jiroh.jpg",
  "../src/jiroh.jpg",
  "../src/jiroh.jpg",
  "../src/jiroh.jpg",
  "../src/jiroh.jpg",
  "../src/sprite1.png",
  "../src/sprite2.png",
  "../src/sprite3.png",
  "../src/sprite4.png",
  "../src/sprite5.png",
];
let gif = new GIF({
  workers: 10,
  quality: 1,
  background: "#000",
  transparent: "0x0",
});

waitForImagesLoaded(urlsToLoad, function (frames) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = 124; // whatever the desired size is
  canvas.height = 124; // old: 500
  frameWidth = canvas.width * 0.925; // old: 0.7
  frameHeight = canvas.width * 0.925;
  handWidth = canvas.width * 0.975; // old: 0.775
  handHeight = canvas.height * 0.925; // old: 0.725
  console.log(frames);
  for (let i = 0; i < frames.length - 5; i++) {
    let frame = frames[i];
    let hand = frames[i + 5];
    ctx.clearRect(0, 0, canvas.width, canvas.height); // not needed if images are guaranteed opaque
    ctx.drawImage(
      frame,
      frameWidth - frameWidth * bounceWidth[i] + (canvas.width - frameWidth),
      frameHeight -
        frameHeight * bounceHeight[i] +
        (canvas.height - frameHeight),
      frameWidth * bounceWidth[i],
      frameHeight * bounceHeight[i]
    ); // stretch image onto canvas (ignoring aspect ratio)
    ctx.drawImage(
      hand,
      0, // handWidth - handWidth + (canvas.width - handWidth)
      handHeight - handHeight + (canvas.height - handHeight),
      frameWidth * 0.9,
      frameHeight * 0.9
    );

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let threshold = 128; // play with threshold 1- 255
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i + 3] = 255 * (imageData.data[i + 3] > threshold);
    }
    ctx.putImageData(imageData, 0, 0);
    gif.addFrame(canvas, { delay: 80, copy: true }); // delay: speed of squish
  }
  gif.on("finished", function (blob) {
    // document.getElementById("image").src = URL.createObjectURL(blob);
    window.open(URL.createObjectURL(blob));
  });

  gif.render();
});
