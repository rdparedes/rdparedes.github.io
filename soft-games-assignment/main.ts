import * as PIXI from "pixi.js";

console.log("Main TypeScript file loaded");

export type Vector2 = {
  x: number;
  y: number;
};

export function tween(app: PIXI.Application, sprite: PIXI.Sprite, destination: Vector2, duration: number) {
  const startX = sprite.x;
  const startY = sprite.y;
  const startTime = Date.now();

  app.ticker.add(function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    sprite.x = startX + (destination.x - startX) * progress;
    sprite.y = startY + (destination.y - startY) * progress;

    if (progress === 1) {
      app.ticker.remove(update);
    }
  });
}

export function drawFPS(app: PIXI.Application) {
  const fpsText = new PIXI.Text("", { fontSize: 48, fill: 0x00ff00, fontFamily: "Arial" });
  fpsText.setTransform(8, 8);
  app.stage.addChild(fpsText);
  app.ticker.add(() => {
    fpsText.text = PIXI.Ticker.shared.FPS.toFixed(0);
  });
}
