import CollisionDetector from './CollisionDetector';

describe('CollisionDetector', () => {
  let collisionDetector;

  beforeEach(() => {
    collisionDetector = CollisionDetector(10, 10);
  });

  it('initially there are no collision objects', () => {
    expect(collisionDetector.getCollisionObjects().length).toBe(0);
  });

  it('adding a collision object, adds it', () => {
    collisionDetector.addCollisionObject({});

    expect(collisionDetector.getCollisionObjects()).toEqual([{}]);
  });

  it('removing a collision object, removes it', () => {
    const removable = { a: 1 };
    collisionDetector.addCollisionObject(removable);
    collisionDetector.addCollisionObject({ b: 2 });

    collisionDetector.removeCollisionObject(removable);

    expect(collisionDetector.getCollisionObjects()).toEqual([{ b: 2 }]);
  });

  describe('checking collision', () => {
    it('if object is going outside from left side of board, returns collision', () => {
      const collidingObject = {
        getLocation: () => ({ cols: [-1, 0, 1, 2], rows: [2] })
      };

      const collision = collisionDetector.checkCollision(collidingObject, { cols: [-1, 0, 1, 2], rows: [2] });

      expect(collision).toBe(true);
    });

    it('if object is going outside from right side of board, returns collision', () => {
      const collidingObject = {
        getLocation: () => ({ cols: [7, 8, 9, 10], rows: [2] })
      };

      const collision = collisionDetector.checkCollision(collidingObject, { cols: [7, 8, 9, 10], rows: [2] });

      expect(collision).toBe(true);
    });

    it('if object is going outside from top of board, returns collision', () => {
      const collidingObject = {
        getLocation: () => ({ cols: [2], rows: [2, 1, 0, -1] })
      };

      const collision = collisionDetector.checkCollision(collidingObject, { cols: [2], rows: [2, 1, 0, -1] });

      expect(collision).toBe(true);
    });

    it('if object is going outside from bottom of board, returns collision', () => {
      const collidingObject = {
        getLocation: () => ({ cols: [2], rows: [10, 9, 8, 7] })
      };

      const collision = collisionDetector.checkCollision(collidingObject, { cols: [2], rows: [10, 9, 8, 7] });

      expect(collision).toBe(true);
    });

    it('if object is on the very edge of board, returns no collision', () => {
      const notCollidingObject1 = {
        getLocation: () => ({ cols: [0, 1, 2, 3], rows: [0] })
      };
      const notCollidingObject2 = {
        getLocation: () => ({ cols: [9], rows: [9, 8] })
      };

      const collision1 = collisionDetector.checkCollision(notCollidingObject1, { cols: [0, 1, 2, 3], rows: [0] });
      const collision2 = collisionDetector.checkCollision(notCollidingObject2, { cols: [9], rows: [9, 8] });

      expect(collision1).toBe(false);
      expect(collision2).toBe(false);
    });

    describe('if object is colliding with another', () => {
      let collidingObject;
      beforeEach(() => {
        collidingObject = {
          getLocation: () => ({
            cols: [3, 4, 5, 6],
            rows: [4]
          }),
          isCollidable: () => false
        };

        collisionDetector.addCollisionObject(collidingObject);
      });

      it('returns collision if it is colliding with another, collidable object', () => {
        const anotherObject = {
          getLocation: () => ({
            cols: [5],
            rows: [6, 5, 4]
          }),
          isCollidable: () => true
        };
        collisionDetector.addCollisionObject(anotherObject);

        const collision = collisionDetector.checkCollision(collidingObject, {
          cols: [3, 4, 5, 6],
          rows: [4]
        });

        expect(collision).toBe(true);
      });

      it('does not return collision if it is not colliding with another, collidable object', () => {
        const anotherObject = {
          getLocation: () => ({
            cols: [2],
            rows: [6, 5, 4]
          }),
          isCollidable: () => true
        };
        collisionDetector.addCollisionObject(anotherObject);

        const collision = collisionDetector.checkCollision(collidingObject, {
          cols: [3, 4, 5, 6],
          rows: [4]
        });

        expect(collision).toBe(false);
      });

      it('does not return collision with another if neither is collidable', () => {
        const anotherObject = {
          getLocation: () => ({
            cols: [5],
            rows: [6, 5, 4]
          }),
          isCollidable: () => false
        };
        collisionDetector.addCollisionObject(anotherObject);

        const collision = collisionDetector.checkCollision(collidingObject, {
          cols: [3, 4, 5, 6],
          rows: [4]
        });

        expect(collision).toBe(false);
      });
    });
  });
});
