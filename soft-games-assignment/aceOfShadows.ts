import * as PIXI from "pixi.js";
import { tween, drawFPS, Vector2 } from "./main";

/** Problem description:
 * Create 144 sprites (NOT graphic objects) that are stacked on top of each other like
 * cards in a deck. The top card must cover the bottom card, but not completely.
 * Every 1 second the top card should move to a different stack - the animation of the
 * movement should take 2 seconds.
 */

const canvas = document.getElementById("aceOfShadowsCanvas") as HTMLCanvasElement;

const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 720;
const SCREEN_CENTER_X = SCREEN_WIDTH / 2;
const SCREEN_CENTER_Y = SCREEN_HEIGHT / 2;
const STACK_SIZE = 144;

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

function moveCard(cardSprite: PIXI.Sprite, destination: Vector2, duration: number) {
  tween(app, cardSprite, destination, duration);
}

function moveStack(speed: number, cardSprites: PIXI.Sprite[], destination: Vector2) {
  return function moveCardSequentially(index: number, animationDuration: number) {
    if (index < 0) return;

    const currentCard = cardSprites[index];
    const cardNewX = destination.x + Math.floor((index - STACK_SIZE) / 10);
    const cardNewY = destination.y + Math.floor((index - STACK_SIZE) / 10);
    moveCard(currentCard, { x: cardNewX, y: cardNewY }, animationDuration);
    currentCard.zIndex = STACK_SIZE - index;

    setTimeout(() => moveCardSequentially(index - 1, animationDuration), speed);
  };
}

async function init() {
  console.log("Ace of Shadows initialized");
  app.stage.sortableChildren = true;
  const cardTexture = await PIXI.Assets.load<PIXI.Texture>("resources/card.png");
  const cardSprites = new Array<PIXI.Sprite>(STACK_SIZE);
  const offsetX = cardTexture.width * 2;
  const offsetY = cardTexture.height / 2;
  const startingX = SCREEN_CENTER_X - offsetX;
  const startingY = SCREEN_CENTER_Y - offsetY;

  // Place the cards
  for (let i = 0; i < STACK_SIZE; i++) {
    cardSprites[i] = PIXI.Sprite.from(cardTexture);
    // Every 10 cards, move the starting position a bit in this ↖ direction, to give the illusion of depth
    const cardX = startingX - Math.floor(i / 10);
    const cardY = startingY - Math.floor(i / 10);
    cardSprites[i].setTransform(cardX, cardY);
    cardSprites[i].zIndex = i;
    app.stage.addChild(cardSprites[i]);
  }

  // Move the cards one by one
  const destination = { x: startingX + 300, y: startingY };
  moveStack(1000, cardSprites, destination)(cardSprites.length - 1, 2000);

  drawFPS(app);
}

await init();
