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
    }
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue'
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
    } else if (keys.d.pressed && player.lastkey === 'd') {
        player.velocity.x = 5;
    }

    // ENEMY movement
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 5;
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
            enemy.velocity.y = -20;
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
            break;


        // Player
        case 'w':
            player.velocity.y = -20;
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