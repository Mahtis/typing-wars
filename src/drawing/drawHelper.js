const loadImage = canvas =>
  new Promise((resolve, reject) => {
    let sprite = new Image();
    sprite.onload = () => {
      resolve(sprite);
    };
    sprite.onerror = reject;
    sprite.src = canvas.toDataURL();
  });

export { loadImage };
