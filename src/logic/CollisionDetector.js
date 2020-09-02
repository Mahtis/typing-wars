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

  const isOutsideBoard = (startX, endX, startY, endY) => {
    if (startX < 0) return true;

    if (endX > boardWidth) return true;

    if (startY < 0) return true;

    if (endY > boardHeight) return true;

    return false;
  };

  const areArraysColliding = (array1, array2) => {
    for (let i = 0; i < array1.length; i += 1) {
      const value = array1[i];
      if (array2.includes(value)) return true;
    }

    return false;
  };

  const checkCollision = (hitboxLocation, id) => {
    const { startX, endX, startY, endY } = hitboxLocation;

    if (isOutsideBoard(startX, endX, startY, endY)) return true;

    for (let i = 0; i < collisionObjects.length; i += 1) {
      const otherObj = collisionObjects[i];

      if (otherObj.getId() === id) continue;

      // if (!otherObj.isCollidable() && !object.isCollidable()) {
      //   return false;
      // }

      if (otherObj.isObjectColliding(hitboxLocation)) return true;
    }

    return false;
  };

  const getCollisionObjects = () => collisionObjects;

  return {
    addCollisionObject,
    removeCollisionObject,
    getCollisionObjects,
    checkCollision
  };
};

export default CollisionDetector;
