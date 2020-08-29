const CollisionDetector = (colsOnBoard, rowsOnBoard) => {
  let collisionObjects = [];

  const nCols = colsOnBoard;
  const nRows = rowsOnBoard;

  const addCollisionObject = object => {
    collisionObjects.push(object);
  };

  const removeCollisionObject = object => {
    collisionObjects = collisionObjects.filter(
      collisionObj => collisionObj !== object
    );
  };

  const isOutsideBoard = (cols, rows) => {
    if (cols[0] < 0) return true;

    if (cols[cols.length - 1] >= nCols) return true;

    if (rows[rows.length - 1] < 0) return true;

    if (rows[0] >= nRows) return true;

    return false;
  };

  const areArraysColliding = (array1, array2) => {
    for (let i = 0; i < array1.length; i += 1) {
      const value = array1[i];
      if (array2.includes(value)) return true;
    }

    return false;
  };

  const checkCollision = object => {
    const { cols, rows } = object.getLocation();

    if (isOutsideBoard(cols, rows)) return true;

    for (let i = 0; i < collisionObjects.length; i += 1) {
      const otherObj = collisionObjects[i];

      if (otherObj === object) continue;

      if (!otherObj.isCollidable() && !object.isCollidable()) {
        return false;
      }

      const { cols: otherCols, rows: otherRows } = otherObj.getLocation();

      if (
        areArraysColliding(cols, otherCols) &&
        areArraysColliding(rows, otherRows)
      ) {
        return true;
      }
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
