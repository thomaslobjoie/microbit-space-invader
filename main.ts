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
        this.invaders = [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 0}, {x: 3, y: 1}, {x: 4, y: 0}];
    }

    step() {
        this.moveShoots();
        this.moveInvaders();
        this.detectExplosions();
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
        this.explosions = [];
        this.explosions = this.comparePoints(this.shoots, this.invaders, true);
        this.shoots = this.comparePoints(this.shoots, this.explosions, false);
        this.invaders = this.comparePoints(this.invaders, this.explosions, false);
    }

    comparePoints(pointsA: Point[], pointsB: Point[], keep: boolean) {
        return pointsA.filter(pointA => 
            pointsB.some(pointB => pointA.x === pointB.x && pointA.y === pointB.y) === keep
        );
    }

    left () {
        // music.playTone(Note.G, 180);
        if (this.ship.x > 0) {
            this.ship.x--;
        }
    }

    right () {
        // music.playTone(Note.G, 180);
        if (this.ship.x < 4) {
            this.ship.x++;
        }
    }

    update() {
        basic.clearScreen();
        this.lightPoints([this.ship], 100);
        this.lightPoints(this.shoots, 50);
        this.lightPoints(this.invaders, 100);
        this.lightPoints(this.explosions, 255);
    }

    lightPoints(points: Point[], brightness: number) {
        points.forEach((value: Point) => {
            led.plotBrightness(value.x, value.y, brightness);
        });
    }
}

music.setOnBoardSpeakerEnabled(false);
music.setVolume(60);

let spaceInvaderGame = new SpaceInvader();

input.onButtonPressed(Button.A, function () {
    spaceInvaderGame.left();
});

input.onButtonPressed(Button.B, function () {
    spaceInvaderGame.right();
});

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    spaceInvaderGame.shoot();
});

/*input.onSound(DetectedSound.Loud, function () {
  spaceInvaderGame.shoot();
});*/

basic.forever(function () {
    spaceInvaderGame.step();
    basic.pause(200);
});
