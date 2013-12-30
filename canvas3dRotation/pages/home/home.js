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


    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            canvas = document.getElementById("mycanvas");
            canvas.width = constants.canvasWidth;
            canvas.height = constants.canvasHeight;
            canvas.getContext('2d').translate(constants.canvasWidth / 2, constants.canvasHeight / 2);
            surface.generate();
            surface.color();

            surface.draw();
        }
    });

    function point(x, y, z)
        /*
          Given a (x, y, z) surface point, returns the 3 x 1 vector form of the point.
        */ {
        return [x, y, z]; // Return a 3 x 1 vector representing a traditional (x, y, z) surface point. This vector form eases matrix multiplication.
    }    function Surface()
        /*
          A surface is a list of (x, y, z) points, in 3 x 1 vector format. This is a constructor function.
        */ {
        this.points = []; // An array of surface points in vector format. That is, each element of this array is a 3 x 1 array, as in [ [x1, y1, z1], [x2, y2, z2], [x3, y3, z3], ... ]
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

    Surface.prototype.equation = function (x, y)
        /*
          Given the point (x, y), returns the associated z-coordinate based on the provided surface equation, of the form z = f(x, y).
        */ {
        var d = Math.sqrt(x * x + y * y); // The distance d of the xy-point from the z-axis.

        return 4 * (Math.sin(d) / d); // Return the z-coordinate for the point (x, y, z). 
    }

})();
