import Hitbox from './Hitbox';

describe('Hitbox', () => {
  let hitbox;

  describe('creating a hitbox', () => {
    beforeEach(() => {
      hitbox = Hitbox({ x: 20, y: 40 }, 80, 20);
    });

    it('should return hitbox coordinates correctly', () => {
      expect(hitbox.getHitboxLocation()).toEqual({
        startX: 20,
        endX: 100,
        startY: 40,
        endY: 60
      });
    });
  
    it('should return hitbox coordinates for new location correctly', () => {
      expect(hitbox.getHitboxForNewLocation(60, 60)).toEqual({
        startX: 60,
        endX: 140,
        startY: 60,
        endY: 80
      });
    });
  
    it('should have proper height', () => {
      expect(hitbox.getHeight()).toEqual(20);
    });
    
    it('should have proper width', () => {
      expect(hitbox.getWidth()).toEqual(80);
    });

    it('should be able to rotate the hitbox', () => {
      hitbox.rotate();

      expect(hitbox.getHeight()).toBe(80);
      expect(hitbox.getWidth()).toBe(20);
    })
    
  });

  it('knows if given location is intersecting with hitbox', () => {
    const location = { x: 20, y: 40 };
    hitbox = Hitbox(location, 100, 20);

    expect(hitbox.isLocationIntersecting({ x: 21, y: 50 })).toBe(true);
  });

  it('knows if given location is not intersecting with hitbox', () => {
    const location = { x: 20, y: 40 };
    hitbox = Hitbox(location, 100, 20);

    expect(hitbox.isLocationIntersecting({ x: 19, y: 50 })).toBe(false);
  });

  it('knows if other hitbox is intersecting with hitbox', () => {
    const otherHitbox = Hitbox({ x: 20, y: 40 }, 20, 20);

    hitbox = Hitbox({ x: 0, y: 30 }, 100, 20);

    expect(hitbox.isObjectIntersecting(otherHitbox.getHitboxLocation())).toBe(true);
  });

  it('returns collision to the left correctly', () => {
    const otherHitbox = Hitbox({ x: 0, y: 180 }, 160, 20);

    hitbox = Hitbox({ x: 140, y: 180 }, 160, 20);

    expect(hitbox.isObjectIntersecting(otherHitbox.getHitboxLocation())).toBe(true);
  });

  it('if other hitbox is above checking hitbox, returns false', () => {
    const otherHitbox = Hitbox({ x: 20, y: 0 }, 20, 20);

    hitbox = Hitbox({ x: 20, y: 20 }, 20, 20);

    expect(hitbox.isObjectIntersecting(otherHitbox.getHitboxLocation())).toBe(false);
  });

  it('if other hitbox is below checking hitbox, returns false', () => {
    const otherHitbox = Hitbox({ x: 20, y: 40 }, 20, 20);

    hitbox = Hitbox({ x: 20, y: 20 }, 20, 20);

    expect(hitbox.isObjectIntersecting(otherHitbox.getHitboxLocation())).toBe(false);
  });

  it('if other hitbox is left of checking hitbox, returns false', () => {
    const otherHitbox = Hitbox({ x: 0, y: 40 }, 20, 20);

    hitbox = Hitbox({ x: 20, y: 40 }, 20, 20);

    expect(hitbox.isObjectIntersecting(otherHitbox.getHitboxLocation())).toBe(false);
  });

  it('if other hitbox is right of checking hitbox, returns false', () => {
    const otherHitbox = Hitbox({ x: 40, y: 40 }, 20, 20);

    hitbox = Hitbox({ x: 20, y: 40 }, 20, 20);

    expect(hitbox.isObjectIntersecting(otherHitbox.getHitboxLocation())).toBe(false);
  });

  it('if the original location moves, so does the hitbox, missing -> hitting', () => {
    const otherHitbox = Hitbox({ x: 40, y: 40 }, 20, 20);

    let location = { x: 20, y: 40 };
    hitbox = Hitbox(location, 20, 20);

    expect(hitbox.isObjectIntersecting(otherHitbox.getHitboxLocation())).toBe(false);

    location.x = 30;

    expect(hitbox.isObjectIntersecting(otherHitbox.getHitboxLocation())).toBe(true);
  });

  it('if the original location moves, so does the hitbox, hitting -> missing', () => {
    const otherHitbox = Hitbox({ x: 40, y: 40 }, 20, 20);

    let location = { x: 30, y: 40 };
    hitbox = Hitbox(location, 20, 20);

    expect(hitbox.isObjectIntersecting(otherHitbox.getHitboxLocation())).toBe(true);

    location.x = 20;

    expect(hitbox.isObjectIntersecting(otherHitbox.getHitboxLocation())).toBe(false);
  });
});
