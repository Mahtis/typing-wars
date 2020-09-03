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

  describe('checking if is object outside board', () => {
    it('if object is going outside from left side of board, returns collision', () => {
      const collidingHitbox = {
        getHitbox: () => ({ startX: -1, endX: 2, startY: 3, endY: 4 })
      };

      const collision = collisionDetector.isOutsideBoard({
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

      const collision = collisionDetector.isOutsideBoard({
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

      const collision = collisionDetector.isOutsideBoard({
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

      const collision = collisionDetector.isOutsideBoard({
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

      const collision1 = collisionDetector.isOutsideBoard({
        startX: 0,
        endX: 10,
        startY: 9,
        endY: 10
      });
      const collision2 = collisionDetector.isOutsideBoard({
        startX: 0,
        endX: 10,
        startY: 0,
        endY: 1
      });

      expect(collision1).toBe(false);
      expect(collision2).toBe(false);
    });
  });

  describe('checking collision', () => {
    let collidingObject;

    beforeEach(() => {
      collidingObject = {
        getHitbox: () => ({ startX: 0, endX: 3, startY: 3, endY: 4 }),
        getId: () => 'some-id'
      };

      collisionDetector.addCollisionObject(collidingObject);
    });

    it('returns an empty array if the colliding object has the same id', () => {
      const collision = collisionDetector.checkCollision(
        { startX: 0, endX: 3, startY: 3, endY: 4 },
        'some-id'
      );

      expect(collision).toEqual([]);
    });

    it('if it is colliding with another object, returns array with that object', () => {
      const anotherObject = {
        isObjectColliding: () => true,
        getId: () => 'some-other-id'
      };
      collisionDetector.addCollisionObject(anotherObject);

      const collision = collisionDetector.checkCollision(
        { startX: 0, endX: 3, startY: 3, endY: 4 },
        'some-id'
      );

      expect(collision).toEqual([anotherObject]);
    });

    it('if it is colliding with multiple objects, returns array with all colliding objects', () => {
      const anotherObject = {
        isObjectColliding: () => true,
        getId: () => 'some-other-id'
      };
      const yetAnotherObject = {
        isObjectColliding: () => true,
        getId: () => 'some-other-2-id'
      };
      const nonCollidingObject = {
        isObjectColliding: () => false,
        getId: () => 'some-other-3-id'
      };
      
      collisionDetector.addCollisionObject(anotherObject);
      collisionDetector.addCollisionObject(yetAnotherObject);
      collisionDetector.addCollisionObject(nonCollidingObject);

      const collision = collisionDetector.checkCollision(
        { startX: 0, endX: 3, startY: 3, endY: 4 },
        'some-id'
      );

      expect(collision).toEqual([anotherObject, yetAnotherObject]);
    });

    it('if it is not colliding with another object, returns empty array', () => {
      const anotherObject = {
        isObjectColliding: () => false,
        getId: () => 'some-other-id'
      };
      collisionDetector.addCollisionObject(anotherObject);

      const collision = collisionDetector.checkCollision(
        { startX: 0, endX: 3, startY: 3, endY: 4 },
        'some-id'
      );

      expect(collision).toEqual([]);
    });
  });
});
