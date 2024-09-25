import * as PIXI from "pixi.js";
import { drawFPS } from "./main";
import * as particles from "@pixi/particle-emitter";

/** Problem description:
 * Make a particle-effect demo showing a great fire effect. Please keep the number of
 * images at max 10 sprites on the screen at the same time.
 */

const canvas = document.getElementById("phoenixFlameCanvas") as HTMLCanvasElement;

const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 720;
const SPRITE_SIZE = 128;

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

function createEmitter(container: PIXI.Container, texture: PIXI.Texture, positionX: number, positionY: number) {
  return new particles.Emitter(container, {
    lifetime: {
      min: 0.1,
      max: 0.75,
    },
    frequency: 0.1,
    spawnChance: 1,
    particlesPerWave: 1,
    maxParticles: 9,
    pos: {
      x: positionX,
      y: positionY,
    },
    addAtBack: true,
    behaviors: [
      {
        type: "alpha",
        config: {
          alpha: {
            list: [
              {
                value: 0.7,
                time: 0,
              },
              {
                value: 0,
                time: 1,
              },
            ],
          },
        },
      },
      {
        type: "scale",
        config: {
          scale: {
            list: [
              {
                value: 0.75,
                time: 0,
              },
              {
                value: 1.5,
                time: 1,
              },
            ],
          },
        },
      },
      {
        type: "rotation",
        config: {
          accel: 0,
          minSpeed: 10,
          maxSpeed: 10,
          minStart: 265,
          maxStart: 275,
        },
      },
      {
        type: "noRotation",
        config: {
          rotation: 0,
        },
      },
      {
        type: "blendMode",
        config: {
          blendMode: "color burn",
        },
      },
      {
        type: "color",
        config: {
          color: {
            list: [
              {
                value: "fff191",
                time: 0,
              },
              {
                value: "ff622c",
                time: 0.6,
              },
              {
                value: "111111",
                time: 0.7,
              },
              {
                value: "333333",
                time: 1,
              },
            ],
            isStepped: false,
          },
        },
      },
      {
        type: "moveSpeedStatic",
        config: {
          min: 500,
          max: 500,
        },
      },
      {
        type: "spawnShape",
        config: {
          type: "torus",
          data: {
            x: 0,
            y: 0,
            radius: 10,
            innerRadius: 0,
            affectRotation: false,
          },
        },
      },
      {
        type: "textureSingle",
        config: {
          texture,
        },
      },
    ],
  });
}

async function init() {
  console.log("Phoenix Flame initialized");

  const baseTexture = (await PIXI.Assets.load<PIXI.Texture>("resources/flame_fire.png")).baseTexture;
  const spriteSheetColumns = Math.floor(baseTexture.width / SPRITE_SIZE);
  const spriteSheetRows = Math.floor(baseTexture.height / SPRITE_SIZE);
  const spriteSheet: PIXI.Texture[] = [];

  // Create textures for each 128x128 sprite
  for (let y = 0; y < spriteSheetRows; y++) {
    for (let x = 0; x < spriteSheetColumns; x++) {
      const spriteTexture = new PIXI.Texture(
        baseTexture,
        new PIXI.Rectangle(x * SPRITE_SIZE, y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE)
      );
      spriteSheet.push(spriteTexture);
    }
  }

  const animatedFire = new PIXI.AnimatedSprite(spriteSheet);
  animatedFire.scale = { x: 3, y: 3 };
  const fireX = SCREEN_WIDTH / 2 - animatedFire.width / 2;
  const fireY = SCREEN_HEIGHT / 2 - animatedFire.height / 2;
  animatedFire.x = fireX;
  animatedFire.y = fireY;
  animatedFire.animationSpeed = 0.3;
  animatedFire.loop = false;

  animatedFire.onComplete = () => {
    animatedFire.gotoAndPlay(12);
  };

  animatedFire.play();
  app.stage.addChild(animatedFire);

  const emitter = createEmitter(
    app.stage,
    spriteSheet[18],
    fireX + animatedFire.width / 2,
    animatedFire.y + animatedFire.height / 2
  );
  emitter.emit = true;

  app.ticker.add((delta) => {
    emitter.update(delta * 0.009);
  });

  drawFPS(app);
}

await init();
