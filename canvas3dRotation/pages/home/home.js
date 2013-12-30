(function () {
    "use strict";
    var canvas = null;
    var surface = new Surface();

    var X = 0;
    var Y = 1;
    var Z = 2;

    var constants = {
        canvasWidth: 600,
        canvasHeight: 600,
        leftArrow: 37,
        upArrow: 38,
        rightArrow: 39,
        downArrow: 40,
        xMin: -9, // RANGE RELATED
        xMax: 9, // RANGE RELATED
        yMin: -9, // RANGE RELATED
        yMax: 9, // RANGE RELATED
        xDelta: 0.2, // RANGE RELATED
        yDelta: 0.2, // RANGE RELATED
        colorMap: ["#060", "#090", "#0C0", "#0F0", "#9F0", "#9C0", "#990", "#960", "#930", "#900", "#C00"],
        pointWidth: 2,
        dTheta: 0.05,
        surfaceScale: 24
    };


    var home = WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var rotateButton = document.getElementById("rotate");
            rotateButton.addEventListener("click", home.prototype.processKeyDown, false);

            canvas = document.getElementById("mycanvas");
            canvas.width = constants.canvasWidth;
            canvas.height = constants.canvasHeight;
            canvas.getContext('2d').translate(constants.canvasWidth / 2, constants.canvasHeight / 2);
            surface.generate();
            surface.color();

            surface.draw();
        },

        processKeyDown: function (e) {
            surface.xRotate(-1);
        }

    });

    function point(x, y, z) {
        return [x, y, z];
    }    function Surface() {
        this.points = [];
    }

    Surface.prototype.generate = function () {
        var i = 0;
        for (var x = constants.xMin; x <= constants.xMax; x += constants.xDelta) {
            for (var y = constants.yMin; y <= constants.yMax; y += constants.yDelta) {
                this.points[i] = point(x, y, this.equation(x, y));
                ++i;
            }
        }
    }

    Surface.prototype.color = function () {
        var z;

        this.zMin = this.zMax = this.points[0][Z];
        for (var i = 0; i < this.points.length; i++) {
            z = this.points[i][Z];
            if (z < this.zMin) { this.zMin = z; }
            if (z > this.zMax) { this.zMax = z; }
        }

        var zDelta = Math.abs(this.zMax - this.zMin) / constants.colorMap.length;

        for (var i = 0; i < this.points.length; i++) {
            this.points[i].color = constants.colorMap[Math.floor((this.points[i][Z] - this.zMin) / zDelta)];
        }
    }

    Surface.prototype.draw = function () {
        var ctx = canvas.getContext("2d");

        this.points = surface.points.sort(surface.sortByZIndex);

        for (var i = 0; i < this.points.length; i++) {
            ctx.fillStyle = this.points[i].color;
            ctx.fillRect(this.points[i][X] * constants.surfaceScale, this.points[i][Y] * constants.surfaceScale, constants.pointWidth, constants.pointWidth);
        }
    }

    Surface.prototype.equation = function (x, y) {
        var d = Math.sqrt(x * x + y * y);
        return 4 * (Math.sin(d) / d);
    }


    Surface.prototype.multi = function (R) {
        var Px = 0, Py = 0, Pz = 0;
        var P = this.points;
        var sum;

        for (var V = 0; V < P.length; V++) {
            Px = P[V][X], Py = P[V][Y], Pz = P[V][Z];
            for (var Rrow = 0; Rrow < 3; Rrow++) {
                sum = (R[Rrow][X] * Px) + (R[Rrow][Y] * Py) + (R[Rrow][Z] * Pz);
                P[V][Rrow] = sum;
            }
        }
    }

    Surface.prototype.xRotate = function (sign) {
        var Rx = [[0, 0, 0],
                   [0, 0, 0],
                   [0, 0, 0]]; // Create an initialized 3 x 3 rotation matrix.

        Rx[0][0] = 1;
        Rx[0][1] = 0; // Redundant but helps with clarity.
        Rx[0][2] = 0;
        Rx[1][0] = 0;
        Rx[1][1] = Math.cos(sign * constants.dTheta);
        Rx[1][2] = -Math.sin(sign * constants.dTheta);
        Rx[2][0] = 0;
        Rx[2][1] = Math.sin(sign * constants.dTheta);
        Rx[2][2] = Math.cos(sign * constants.dTheta);

        this.multi(Rx); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw();
    }

    Surface.prototype.erase = function () {
        var ctx = canvas.getContext("2d");

        ctx.clearRect(-constants.canvasWidth / 2, -constants.canvasHeight / 2, canvas.width, canvas.height);
    }


})();
