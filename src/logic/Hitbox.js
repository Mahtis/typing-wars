const Hitbox = (location, initialWidth, initialHeight) => {
  let width = initialWidth;
  let height = initialHeight;

  // googled it SeemsGood
  const isObjectIntersecting = otherHitboxLocation => {
    const { startX, endX, startY, endY } = otherHitboxLocation;
    const {
      startX: ownStartX,
      endX: ownEndX,
      startY: ownStartY,
      endY: ownEndY
    } = getHitboxLocation();
    if (
      ownStartX < endX &&
      ownEndX > startX &&
      ownStartY < endY &&
      ownEndY > startY
    ) {
      return true;
    }
    return false;
  };

  const isLocationIntersecting = intersectingLocation => {
    if (
      intersectingLocation.x > location.x &&
      intersectingLocation.x < location.x + width &&
      intersectingLocation.y > location.y &&
      intersectingLocation.y < location.y + height
    ) {
      return true;
    }
    return false;
  };

  const getWidth = () => width;

  const getHeight = () => height;

  const rotate = () => {
    const newHeight = width;
    width = height;
    height = newHeight;
  };

  const getHitboxLocation = () => {
    return {
      startX: location.x,
      endX: location.x + width,
      startY: width > height ? location.y : location.y - height + 20,
      endY: width > height ? location.y + height : location.y + 20
    };
  };

  const getHitboxForNewLocation = (x, y) => ({
    startX: x,
    endX: x + width,
    startY: width > height ? y : y - height + 20,
    endY: width > height ? y + height : y + 20
  });

  return {
    isObjectIntersecting,
    isLocationIntersecting,
    getWidth,
    getHeight,
    rotate,
    getHitboxLocation,
    getHitboxForNewLocation
  };
};

export default Hitbox;
