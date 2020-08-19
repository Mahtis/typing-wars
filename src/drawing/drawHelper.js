const loadImage = canvas =>
  new Promise((resolve, reject) => {
    let sprite = new Image();
    sprite.onload = () => {
      resolve(sprite);
    };
    sprite.onerror = reject;
    sprite.src = canvas.toDataURL();
  });

const createCanvasWithSprite = (tileset, spriteData) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = spriteData.width;
  canvas.height = spriteData.height;

  ctx.drawImage(
    tileset,
    spriteData.x,
    spriteData.y,
    spriteData.width,
    spriteData.height,
    0,
    0,
    spriteData.width,
    spriteData.height
  );

  return canvas;
};

/*
* Returns an object in the form of { <name of sprite>: <Image for sprite>, }
*/
const loadSprites = async (tileset, tilemapData) => {
  const spriteArray = await Promise.all(
    Object.keys(tilemapData).map(async key => {
      const canvas = createCanvasWithSprite(tileset, tilemapData[key]);

      const sprite = await loadImage(canvas);
      return { name: key, sprite };
    })
  );

  const sprites = spriteArray.reduce(
    (obj, item) => ((obj[item.name] = item.sprite), obj),
    {}
  );

  return sprites;
};

/*
* Returns an object in the form of 
{ 
  <name of animation>: [{ sprite: <Image for sprite>, duration: <frame duration> }] 
}
*/
const loadAnimationSprites = async (tileset, animationSpriteData) => {
  const spriteArray = await Promise.all(
    Object.keys(animationSpriteData).map(async key => {
      const spriteList = animationSpriteData[key];
      const spritesForAnimation = await Promise.all(
        spriteList.map(async imgData => {
          const canvas = createCanvasWithSprite(tileset, imgData);

          const sprite = await loadImage(canvas);
          return { sprite, duration: imgData.duration };
        })
      );

      return { name: key, sprites: spritesForAnimation };
    })
  );

  const animationSprites = spriteArray.reduce(
    (obj, item) => ((obj[item.name] = item.sprites), obj),
    {}
  );

  return animationSprites;
};

export { loadImage, createCanvasWithSprite, loadSprites, loadAnimationSprites };
