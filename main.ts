interface Point {
    x: number;
    y: number;
}

class SpaceInvader {
    private status = 'init';
    private level = 0;
    private score = 0;
    private nbShoots = 0;
    private gameSpeed = 100;
    private ship = {x: 2, y: 4};
    private shoots: Point[];
    private invaders: Point[];
    private explosions: Point[];
    

    public constructor() {}

    public step() {
        this.moveShoots();
        this.moveInvaders();
        this.detectExplosions();
        this.update();
        this.checkGameStatus();
    }

    public shoot() {
        this.shoots.push({x: this.ship.x, y: this.ship.y});
        this.nbShoots++;
    }

    public left () {
        if (this.ship.x > 0) {
            this.ship.x--;
        }
    }

    public right () {
        if (this.ship.x < 4) {
            this.ship.x++;
        }
    }

    public getScore () {
        return this.score;
    }

    public getStatus () {
        return this.status;
    }
    public getLevel() {
        return this.level;
    }

    public nextLevel() {
        this.level++;
        this.ship = {x: 2, y: 4};
        this.shoots = [];
        this.invaders = [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 0}, {x: 3, y: 1}, {x: 4, y: 0}];
        this.status = 'play';
    }

    public restartGame() {
        this.level = 0;
        this.nextLevel();
    }

    private moveShoots() {
        this.shoots = this.shoots.filter((shoot: Point) => shoot.y > 0);
        this.shoots.forEach((shoot: Point) => {
            shoot.y--;
        });
    }

    private moveInvaders() {}

    private detectExplosions() {
        this.explosions = [];
        this.explosions = this.comparePoints(this.shoots, this.invaders, true);
        this.shoots = this.comparePoints(this.shoots, this.explosions, false);
        this.invaders = this.comparePoints(this.invaders, this.explosions, false);
    }

    private comparePoints(pointsA: Point[], pointsB: Point[], keep: boolean) {
        return pointsA.filter(pointA => 
            pointsB.some(pointB => pointA.x === pointB.x && pointA.y === pointB.y) === keep
        );
    }

    private checkGameStatus() {
        this.score += this.explosions.length;
        if(this.invaders.length === 0) {
            if(this.level > 2) {
                this.status = 'end_game';
            } else {
                this.status = 'end_level';
            }
        }
    }

    private update() {
        basic.clearScreen();
        this.lightPoints([this.ship], 100);
        this.lightPoints(this.shoots, 50);
        this.lightPoints(this.invaders, 100);
        this.lightPoints(this.explosions, 255);
    }

    private lightPoints(points: Point[], brightness: number) {
        points.forEach((value: Point) => {
            led.plotBrightness(value.x, value.y, brightness);
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

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    let gameStatus = spaceInvaderGame.getStatus();
    switch(gameStatus) {
        case 'init':
            spaceInvaderGame.nextLevel();
            break;
        case 'play':
            spaceInvaderGame.shoot();
            break;
        case 'end_level':
            spaceInvaderGame.nextLevel();
            break;
        case 'end_game':
            spaceInvaderGame.restartGame();
            break;
    }
});

basic.forever(function () {
    let gameStatus = spaceInvaderGame.getStatus();
    switch(gameStatus) {
        case 'init':
            basic.showIcon(IconNames.Ghost);
            basic.pause(100);
            break;
        case 'play':
            spaceInvaderGame.step();
            basic.pause(200);
            break;
        case 'end_level':
            basic.showNumber(spaceInvaderGame.getLevel());
            basic.pause(100);
            break;
        case 'end_game':
            basic.showIcon(IconNames.Skull);
            basic.showString('Score: ' + spaceInvaderGame.getScore());
            basic.showIcon(IconNames.Skull);
            basic.pause(1000);
            break;
    }
});
