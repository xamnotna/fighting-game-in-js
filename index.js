const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './sprites/Forest of Illusion Files/Previews/Previewx3.png',
    scale: 0.8
})

const ground1 = new Sprite({
    position: {
        x: 800,
        y: 470
    },
    imageSrc: './sprites/Forest of Illusion Files/Layers/tiles.png',
    scale: 2
});
const ground2 = new Sprite({
    position: {
        x: 700,
        y: 470
    },
    imageSrc: './sprites/Forest of Illusion Files/Layers/tiles.png',
    scale: 2
});

const onLooker = new Sprite({
    position: {
        x: 800,
        y: 325
    },
    imageSrc: './sprites/General Teddie/kus000_00.png',
    scale: 0.5,
    framesMax: 3,
    framesHold: 9,
})



const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './sprites/Yu/Idle.png',
    framesMax: 10,
    scale: 0.6,
    offset: {
        x: -50,
        y: 90
    },
    sprites: {
        idle: {
            imageSrc: './sprites/Yu/Idle.png',
            framesMax: 10,
        },
        walk: {
            imageSrc: './sprites/Yu/Walk.png',
            framesMax: 11,
        },
        jump: {
            imageSrc: './sprites/Yu/Jump.png',
            framesMax: 5,
        },
        fall: {
            imageSrc: './sprites/Yu/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './sprites/Yu/Attack01.png',
            framesMax: 8,

        },
        attack2: {
            imageSrc: './sprites/Yu/Attack02.png',
            framesMax: 9,
        },
    }
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './sprites/Aigis/Idle.png',
    framesMax: 10,
    scale: 0.6,
    offset: {
        x: -50,
        y: 70
    },
    sprites: {
        idle: {
            imageSrc: './sprites/Aigis/Idle.png',
            framesMax: 10,
        },
        walk: {
            imageSrc: './sprites/Aigis/Walk.png',
            framesMax: 10,
        },
        jump: {
            imageSrc: './sprites/Aigis/Jump.png',
            framesMax: 5,
        },
        fall: {
            imageSrc: './sprites/Aigis/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './sprites/Aigis/Attack01.png',
            framesMax: 8,

        },
        attack2: {
            imageSrc: './sprites/Aigis/Attack02.png',
            framesMax: 14,
        },
    }
});

console.log(player);

const keys = {
    ArrowUp: { pressed: false, },
    Arrowdown: { pressed: false, },
    ArrowLeft: { pressed: false, },
    ArrowRight: { pressed: false, },
    w: { pressed: false, },
    s: { pressed: false, },
    a: { pressed: false, },
    d: { pressed: false, },
}


decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    ground1.update();
    ground2.update();
    onLooker.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // PLAYER movement
    if (keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('walk');
    } else if (keys.d.pressed && player.lastkey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('walk');
    } else {
        player.switchSprite('idle');
    }
    // PLAYER jump
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }
    // PLAYER attack
    if (player.image === player.sprites.attack1.image &&
        player.framesCurrent === player.sprites.attack1.framesMax - 1
    ) {
        setTimeout(() => {
            player.position.x += 190;
        }, 10);
    }

    // ENEMY movement
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('walk');
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('walk');
    } else {
        enemy.switchSprite('idle');
    }

    // enemy change position when attacking 
    if (enemy.lastkey === 'ArrowRight' && enemy.sprite === 'attack1') {
        enemy.position.x += 190;
    } else if (enemy.lastkey === 'ArrowLeft' && enemy.sprite === 'attack1') {
        enemy.position.x -= 5;
    }

    // ENEMY jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // detect collision
    if (
        rectangularCollision({
            rect1: player,
            rect2: enemy
        }) && player.isAttacking) {
        player.isAttacking = false;
        enemy.health -= 10;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if (
        rectangularCollision({
            rect1: enemy,
            rect2: player
        }) && enemy.isAttacking) {
        enemy.isAttacking = false;
        player.health -= 10;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    // end game based on health
    if (player.health <= 0 || enemy.health <= 0) {
        determinWinner({ player, enemy, timerId });
    }

}

animate();

window.addEventListener('keydown', (e) => {

    switch (e.key) {

        //Enemy
        case 'ArrowUp':
            if (enemy.velocity.y === 0) {
                enemy.velocity.y = -15;
            }
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = 'ArrowLeft';
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastkey = 'ArrowRight';
            break;
        case '0':
            enemy.attack();

            /*  if (!enemy.isAttacking) {
                 enemy.position.x -= 190;
             }
             // enemy.position.x += 190;
  */
            break;


        // Player
        case 'w':
            if (player.velocity.y === 0) {
                player.velocity.y = -15;
            }
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastkey = 'a';
            break;
        case 'd':
            keys.d.pressed = true;
            player.lastkey = 'd';
            break;
        case ' ':
            player.attack();
            player.position.x -= 190;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        // Enemy
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;

        //player
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});