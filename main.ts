interface Point {
    x: number;
    y: number;
}

class SpaceInvader {
    score: number = 0;
    nbShoots: number = 1;
    ship: Point = {x: 2, y: 4};
    shoots: Point[];
    invaders: Point[];
    explosions: Point[];
    gameSpeed = 100;

    constructor() {
        this.shoots = [];
        this.invaders = [{x: 1, y: 1}, {x: 3, y: 2}];
    }

    step() {
        this.detectExplosions();
        this.moveShoots();
        this.moveInvaders();
        this.update();
    }

    shoot() {
        this.shoots.push({x: this.ship.x, y: this.ship.y});
    }

    moveShoots() {
        this.shoots = this.shoots.filter((shoot: Point) => shoot.y > 0);
        this.shoots.forEach((shoot: Point) => {
            shoot.y--;
        });
    }

    moveInvaders() {
        /*this.shoots = this.shoots.filter((shoot: Point) => shoot.y > 0);
        this.shoots.forEach((shoot: Point) => {
            shoot.y--;
        });*/
    }

    detectExplosions() {
        /*this.shoots = this.shoots.filter((shoot: Point) => { 
            let isColliding = this.invaders.find(shoot) === -1;
            console.log(isColliding);
            return isColliding;
        });*/
    }

    left () {
        if (this.ship.x > 0) {
            this.ship.x--;
        }
    }

    right () {
        if (this.ship.x < 4) {
            this.ship.x++;
        }
    }

    update() {
        basic.clearScreen();
        led.plotBrightness(this.ship.x, this.ship.y, 100);
        this.shoots.forEach((value: Point) => {
            led.plotBrightness(value.x, value.y, 50);
        });
        this.invaders.forEach((value: Point) => {
            led.plotBrightness(value.x, value.y, 100);
        });
    }
}

let spaceInvaderGame = new SpaceInvader();

input.onButtonPressed(Button.A, function () {
    spaceInvaderGame.left();
});

input.onButtonPressed(Button.B, function () {
    spaceInvaderGame.right();
});

input.onPinReleased(TouchPin.P0, function () {
    spaceInvaderGame.shoot();
});

basic.forever(function () {
    spaceInvaderGame.step();
    basic.pause(200);
});