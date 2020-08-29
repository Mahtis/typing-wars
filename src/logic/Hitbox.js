const Hitbox = (location, initialWidth, initialHeight) => {
  let width = initialWidth;
  let height = initialHeight;

  // googled it SeemsGood
  const isObjectIntersecting = otherHitbox => {
    const { startX, endX, startY, endY } = otherHitbox.getHitboxCoordinates();
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

  const getHitboxCoordinates = () => {
    return {
      startX: location.x,
      endX: location.x + width,
      startY: location.y,
      endY: location.y + height
    };
  };

  return {
    isObjectIntersecting,
    isLocationIntersecting,
    getHitboxCoordinates
  };
};

export default Hitbox;
