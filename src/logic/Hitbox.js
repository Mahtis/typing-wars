const Hitbox = (location, initialWidth, initialHeight) => {
  let width = initialWidth;
  let height = initialHeight;

  // googled it SeemsGood
  const isObjectIntersecting = otherHitboxLocation => {
    const { startX, endX, startY, endY } = otherHitboxLocation;
    if (
      location.x < endX &&
      location.x + width > startX &&
      location.y < endY &&
      location.y + height > startY
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

  const getHitboxLocation = () => {
    return {
      startX: location.x,
      endX: location.x + width,
      startY: location.y,
      endY: location.y + height
    };
  };

  const getHitboxForNewLocation = (x, y) => ({
    startX: x,
    endX: x + width,
    startY: y,
    endY: y + height
  });

  return {
    isObjectIntersecting,
    isLocationIntersecting,
    getHitboxLocation,
    getHitboxForNewLocation
  };
};

export default Hitbox;
