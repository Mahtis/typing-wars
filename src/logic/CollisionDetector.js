const CollisionDetector = (boardWidth, boardHeight) => {
  let collisionObjects = [];

  const addCollisionObject = object => {
    collisionObjects.push(object);
  };

  const removeCollisionObject = object => {
    collisionObjects = collisionObjects.filter(
      collisionObj => collisionObj !== object
    );
  };

  const isOutsideBoard = (hitboxLocation) => {
    const { startX, endX, startY, endY } = hitboxLocation;

    if (startX < 0) return true;

    if (endX > boardWidth) return true;

    // if (startY < 0) return true;

    if (endY > boardHeight) return true;

    return false;
  };

  const checkCollision = (hitboxLocation, id) => {
    const collidingObjects = [];

    for (let i = 0; i < collisionObjects.length; i += 1) {
      const otherObj = collisionObjects[i];

      if (otherObj.getId() === id) continue;

      if (otherObj.isObjectColliding(hitboxLocation)) {
        collidingObjects.push(otherObj);
      };
    }

    return collidingObjects;
  };

  const getCollisionObjects = () => collisionObjects;

  return {
    addCollisionObject,
    removeCollisionObject,
    getCollisionObjects,
    isOutsideBoard,
    checkCollision
  };
};

export default CollisionDetector;
