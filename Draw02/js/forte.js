var X = 0;
var Y = 1;
var Z = 2;

var constants = {
    pointWidth: 5,
    dTheta: 0.05,
    surfaceScale: 1
};


function Forte3D() {
    this.canvas = null;
    this.context = null;
    this.basePoints = [];
    this.basePointsStorage = [];
    this.headPoints = [];
    this.altitude = 0;
}

Forte3D.prototype.draw = function () {
    this.context.lineWidth = 10;
    this.context.beginPath();
    this.context.moveTo(this.basePoints[0][X], this.basePoints[0][Y]);
    for (var i = 0; i < this.basePoints.length; i++) {
        if (i < this.basePoints.length - 1) {
            this.context.lineTo(this.basePoints[i + 1][X], this.basePoints[i + 1][Y]);
        }
    }
    this.context.closePath();
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(this.headPoints[0][X], this.headPoints[0][Y]);
    for (var i = 0; i < this.headPoints.length; i++) {
        if (i < this.headPoints.length - 1) {
            this.context.lineTo(this.headPoints[i + 1][X], this.headPoints[i + 1][Y]);
        }
    }
    this.context.closePath();
    this.context.stroke();

    this.context.lineWidth = 2;
    for (var i = 0; i < this.basePoints.length; i = i + 1) {
        this.context.beginPath();
        this.context.moveTo(this.basePoints[i][X], this.basePoints[i][Y]);
        this.context.lineTo(this.headPoints[i][X], this.headPoints[i][Y]);
        this.context.closePath();
        this.context.stroke();
    }

}

Forte3D.prototype.multi = function (R, P) {
    var Px = 0, Py = 0, Pz = 0;
    var sum;

    for (var V = 0; V < P.length; V++) {
        Px = P[V][X], Py = P[V][Y], Pz = P[V][Z];
        for (var Rrow = 0; Rrow < 3; Rrow++) {
            sum = (R[Rrow][X] * Px) + (R[Rrow][Y] * Py) + (R[Rrow][Z] * Pz);
            P[V][Rrow] = sum;
        }

    }
}

Forte3D.prototype.xRotate = function (sign, points) {
    var Rx = [[0, 0, 0],
               [0, 0, 0],
               [0, 0, 0]];

    Rx[0][0] = 1;
    Rx[0][1] = 0;
    Rx[0][2] = 0;
    Rx[1][0] = 0;
    Rx[1][1] = Math.cos(sign * constants.dTheta);
    Rx[1][2] = -Math.sin(sign * constants.dTheta);
    Rx[2][0] = 0;
    Rx[2][1] = Math.sin(sign * constants.dTheta);
    Rx[2][2] = Math.cos(sign * constants.dTheta);

    this.multi(Rx, points);
}

Forte3D.prototype.generateHeadPoints = function () {
    this.headPoints = [];

    for (var i = 0; i < this.basePoints.length; i++) {
        this.headPoints.push([this.basePoints[i][0], this.basePoints[i][1], this.altitude]);
    }
}
