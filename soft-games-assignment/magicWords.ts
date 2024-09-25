import * as PIXI from "pixi.js";
import { drawFPS } from "./main";
import { faker } from "@faker-js/faker";

/** Problem description:
 * Create a tool that allows you to mix text and images (not emojis) in an easy way.
 * Every 2 seconds it should display a random text with images in a random
 * configuration and font size.
 */

const canvas = document.getElementById("magicWordsCanvas") as HTMLCanvasElement;

const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 720;

const app = new PIXI.Application({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  backgroundColor: 0xffffff,
  view: canvas,
});

// Fullscreen functionality
const fullscreenButton = document.getElementById("fullscreenButton");
fullscreenButton?.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    canvas?.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

function randomizeText(t: PIXI.Text) {
  t.text = faker.word.noun();
  t.style.fontSize = faker.number.int({ min: 15, max: 125 });
  t.setTransform(
    faker.number.int({ min: 0, max: SCREEN_WIDTH - t.width }),
    faker.number.int({ min: 0, max: SCREEN_HEIGHT - t.height })
  );
  t.style.fill = faker.color.rgb({ prefix: "0x" });
}

function randomizeImages(images: PIXI.Sprite[]) {
  images.forEach((image) => {
    image.setTransform(
      faker.number.int({ min: 0, max: SCREEN_WIDTH }),
      faker.number.int({ min: 0, max: SCREEN_HEIGHT })
    );
    image.scale = {
      x: faker.number.float({ min: 0.2, max: 0.5 }),
      y: faker.number.float({ min: 0.2, max: 1.0 }),
    };
    image.angle = faker.number.int({ min: 0, max: 359 });
  });
}

async function init() {
  console.log("Magic Words initialized");
  const randomText = new PIXI.Text("Hello world", {
    fontSize: 40,
    fill: 0x00dada,
    fontFamily: ["Nunito", "Arial"],
    dropShadow: true,
    dropShadowBlur: 3,
    dropShadowColor: 0x666666,
  });
  const textures = await PIXI.Assets.load<PIXI.Texture>([
    "resources/1.avif",
    "resources/2.avif",
    "resources/3.avif",
    "resources/4.avif",
    "resources/5.jng",
  ]);
  const sprites: PIXI.Sprite[] = Object.values(textures).map((texture) => new PIXI.Sprite(texture));

  app.stage.addChild(...sprites);
  app.stage.addChild(randomText);

  let elapsedTime = 0;
  const interval = 2000;
  const ticker = new PIXI.Ticker();

  ticker.add(() => {
    elapsedTime += ticker.elapsedMS;

    // Check if 2 seconds have passed
    if (elapsedTime >= interval) {
      randomizeText(randomText);
      randomizeImages(sprites);

      elapsedTime = 0;
    }
  });

  ticker.start();

  drawFPS(app);
}

await init();
