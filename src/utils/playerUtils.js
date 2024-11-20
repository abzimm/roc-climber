import { Sprite } from "../components/Sprite";
import { loadImage } from "./imageUtils";
import {
  PLAYER_SPRITE_PATH,
  INITIAL_PLAYER_HEALTH,
} from "../constants/gameConstants";

let playerSprite = null;

export const loadPlayerSprite = async () => {
  try {
    const image = await loadImage(PLAYER_SPRITE_PATH);
    playerSprite = new Sprite(image, 1.8);
    return playerSprite;
  } catch (error) {
    console.error("Failed to load player sprite:", error);
    throw error;
  }
};

export const createPlayer = (x, y) => ({
  x,
  y,
  width: 32 * 1.8,
  height: 32 * 1.8,
  speed: 5.15,
  climbSpeed: 4.2,
  jumpStrength: -5.2,
  yVelocity: 0,
  isJumping: false,
  jumpHoldTime: 0,
  maxJumpHoldTime: 6.3,
  isOnLadder: false,
  direction: 1,
  sprite: playerSprite,
  health: INITIAL_PLAYER_HEALTH,
  lastJumpTime: 0,
  jumpCooldown: 500,
});

const checkLadderCollision = (player, ladders) => {
  return ladders.some((ladder) => {
    const playerCenterX = player.x + player.width / 2;
    const ladderCenterX = ladder.x + 15;
    const onLadderHorizontally = Math.abs(playerCenterX - ladderCenterX) < 8;
    const playerBottom = player.y + player.height;
    const onLadderVertically =
      playerBottom > ladder.y && player.y < ladder.y + ladder.height;
    return onLadderHorizontally && onLadderVertically;
  });
};

export const updatePlayer = (
  player,
  keys,
  levelWidth,
  levelHeight,
  platforms,
  ladders,
  deltaTime
) => {
  let newPlayer = { ...player };
  let isMoving = false;
  const currentTime = Date.now();

  const wantsToClimb = keys.ArrowUp || keys.ArrowDown;
  const onLadder =
    (wantsToClimb || player.isOnLadder) &&
    checkLadderCollision(newPlayer, ladders);

  if (onLadder) {
    if (wantsToClimb) {
      newPlayer.isOnLadder = true;
      newPlayer.yVelocity = 0;
      newPlayer.y += keys.ArrowUp ? -player.climbSpeed : player.climbSpeed;
      isMoving = true;
    }

    if (keys.ArrowLeft) {
      newPlayer.x -= player.speed;
      newPlayer.direction = -1;
      isMoving = true;
    } else if (keys.ArrowRight) {
      newPlayer.x += player.speed;
      newPlayer.direction = 1;
      isMoving = true;
    }
  } else {
    newPlayer.isOnLadder = false;
    if (keys.ArrowLeft) {
      newPlayer.x -= player.speed;
      newPlayer.direction = -1;
      isMoving = true;
    } else if (keys.ArrowRight) {
      newPlayer.x += player.speed;
      newPlayer.direction = 1;
      isMoving = true;
    }

    newPlayer.yVelocity += 0.8;

    const canJump =
      currentTime - newPlayer.lastJumpTime > newPlayer.jumpCooldown;
    if (
      keys.Space &&
      !newPlayer.isJumping &&
      isOnGround(newPlayer, platforms) &&
      canJump
    ) {
      newPlayer.yVelocity = player.jumpStrength;
      newPlayer.isJumping = true;
      newPlayer.jumpHoldTime = 0;
      newPlayer.lastJumpTime = currentTime;
    } else if (
      keys.Space &&
      newPlayer.jumpHoldTime < newPlayer.maxJumpHoldTime
    ) {
      newPlayer.yVelocity -= 0.5;
      newPlayer.jumpHoldTime++;
    } else if (!keys.Space) {
      newPlayer.jumpHoldTime = newPlayer.maxJumpHoldTime;
    }

    newPlayer.y += newPlayer.yVelocity;
  }

  applyCollisionsAndConstraints(
    newPlayer,
    platforms,
    levelWidth,
    levelHeight,
    onLadder
  );

  if (newPlayer.sprite) {
    if (newPlayer.isOnLadder) {
      newPlayer.sprite.setAnimation("climb");
    } else {
      newPlayer.sprite.setAnimation(isMoving ? "run" : "idle");
    }
    newPlayer.sprite.update(deltaTime);
  }

  return newPlayer;
};

export const drawPlayer = (ctx, player) => {
  if (player.sprite) {
    player.sprite.draw(
      ctx,
      Math.round(player.x),
      Math.round(player.y),
      player.direction
    );
  } else {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
};

const applyCollisionsAndConstraints = (
  player,
  platforms,
  levelWidth,
  levelHeight,
  onLadder
) => {
  let onGround = false;

  if (!onLadder) {
    for (let platform of platforms) {
      if (checkCollision(player, platform)) {
        resolveCollision(player, platform);
        if (player.yVelocity >= 0) {
          onGround = true;
        }
      }
    }

    if (onGround) {
      player.yVelocity = 0;
      player.isJumping = false;
    }
  }

  player.x = Math.max(0, Math.min(player.x, levelWidth - player.width));
  player.y = Math.max(0, Math.min(player.y, levelHeight - player.height));
};

const checkCollision = (player, platform) => {
  return (
    player.x < platform.x + platform.width &&
    player.x + player.width > platform.x &&
    player.y < platform.y + platform.height &&
    player.y + player.height > platform.y
  );
};

const resolveCollision = (player, platform) => {
  const overlapLeft = player.x + player.width - platform.x;
  const overlapRight = platform.x + platform.width - player.x;
  const overlapTop = player.y + player.height - platform.y;
  const overlapBottom = platform.y + platform.height - player.y;

  const minOverlapX = Math.min(overlapLeft, overlapRight);
  const minOverlapY = Math.min(overlapTop, overlapBottom);

  if (minOverlapX < minOverlapY) {
    player.x += overlapLeft < overlapRight ? -minOverlapX : minOverlapX;
  } else {
    player.y += overlapTop < overlapBottom ? -minOverlapY : minOverlapY;
    if (overlapTop < overlapBottom) {
      player.yVelocity = 0;
      if (platform.speed && platform.axis === "y") {
        player.y = platform.y - player.height;
      }
    }
  }
};

const isOnGround = (player, platforms) => {
  const testPlayer = { ...player, y: player.y + 1 };
  return platforms.some((platform) => checkCollision(testPlayer, platform));
};
