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
      const collidingHitbox = {
        getHitbox: () => ({ startX: -1, endX: 2, startY: 3, endY: 4 })
      };

      const collision = collisionDetector.checkCollision({
        startX: -1,
        endX: 2,
        startY: 3,
        endY: 4
      });

      expect(collision).toBe(true);
    });

    it('if object is going outside from right side of board, returns collision', () => {
      const collidingHitbox = {
        getHitbox: () => ({ startX: 8, endX: 11, startY: 3, endY: 4 })
      };

      const collision = collisionDetector.checkCollision({
        startX: 8,
        endX: 11,
        startY: 3,
        endY: 4
      });

      expect(collision).toBe(true);
    });

    it('if object is going outside from top of board, returns collision', () => {
      const collidingHitbox = {
        getHitbox: () => ({ startX: 8, endX: 10, startY: -1, endY: 4 })
      };

      const collision = collisionDetector.checkCollision({
        startX: 8,
        endX: 10,
        startY: -1,
        endY: 4
      });

      expect(collision).toBe(true);
    });

    it('if object is going outside from bottom of board, returns collision', () => {
      const collidingHitbox = {
        getHitbox: () => ({ startX: 0, endX: 10, startY: 10, endY: 11 })
      };

      const collision = collisionDetector.checkCollision({
        startX: 0,
        endX: 10,
        startY: 10,
        endY: 11
      });

      expect(collision).toBe(true);
    });

    it('if object is on the very edge of board, returns no collision', () => {
      const notCollidingHitbox1 = {
        getHitbox: () => ({ startX: 0, endX: 10, startY: 9, endY: 10 })
      };
      const notCollidingHitbox2 = {
        getHitbox: () => ({ startX: 0, endX: 10, startY: 0, endY: 1 })
      };

      const collision1 = collisionDetector.checkCollision({
        startX: 0,
        endX: 10,
        startY: 9,
        endY: 10
      });
      const collision2 = collisionDetector.checkCollision({
        startX: 0,
        endX: 10,
        startY: 0,
        endY: 1
      });

      expect(collision1).toBe(false);
      expect(collision2).toBe(false);
    });

    describe('when checking if object is colliding with another', () => {
      let collidingObject;

      beforeEach(() => {
        collidingObject = {
          getHitbox: () => ({ startX: 0, endX: 3, startY: 3, endY: 4 }),
          getId: () => 'some-id'
        };

        collisionDetector.addCollisionObject(collidingObject);
      });

      it('returns false if the colliding object has the same id', () => {
        const collision = collisionDetector.checkCollision(
          { startX: 0, endX: 3, startY: 3, endY: 4 },
          'some-id'
        );

        expect(collision).toBe(false);
      });

      it('returns collision if it is colliding with another, collidable object', () => {
        const anotherObject = {
          isObjectColliding: () => true,
          getId: () => 'some-other-id'
        };
        collisionDetector.addCollisionObject(anotherObject);

        const collision = collisionDetector.checkCollision(
          { startX: 0, endX: 3, startY: 3, endY: 4 },
          'some-id'
        );

        expect(collision).toBe(true);
      });

      it('does not return collision if it is not colliding with another, collidable object', () => {
        const anotherObject = {
          isObjectColliding: () => false,
          getId: () => 'some-other-id'
        };
        collisionDetector.addCollisionObject(anotherObject);

        const collision = collisionDetector.checkCollision(
          { startX: 0, endX: 3, startY: 3, endY: 4 },
          'some-id'
        );

        expect(collision).toBe(false);
      });
    });
  });
});
