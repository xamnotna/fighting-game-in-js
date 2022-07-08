const rectangularCollision = ({ rect1, rect2 }) => {
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
        rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.height
    )
}

const determinWinner = ({ player, enemy, timerId }) => {
    clearTimeout(timerId);
    document.querySelector('#displayWinner').style.display = 'flex';
    if (player.health === enemy.health) {
        document.querySelector('#displayWinner').innerHTML = 'Draw';
    }
    if (player.health > enemy.health) {
        document.querySelector('#displayWinner').innerHTML = 'PLAYER 1 WINS';
    }
    if (player.health < enemy.health) {
        document.querySelector('#displayWinner').innerHTML = 'PLAYER 2 WINS';
    }
}


let timer = 60;
let timerId;
const decreaseTimer = () => {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
        document.querySelector('#displayWinner').style.display = 'flex';
        determinWinner({ player, enemy, timerId });
    }
}
