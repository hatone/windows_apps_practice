(function () {
    "use strict";

    var MARGIN_WIDTH;
    var MARGIN_HEIGHT;
    var ROTATE_MAX = 15;

    var canvasObject = {
        canvas: null,
        context: null,
        drawFlag: false,
        tempPoint: {
            x: 0,
            y: 0
        },
        mouseDownPoint: {
            x: 0,
            y: 0
        },
        mouseUpPoint: {
            x: 0,
            y: 0
        }
    };

    var surface = new Forte3D();
    var rotateTime = 0;
    var fingersOnField = 0;
    var home = WinJS.UI.Pages.define("/pages/home/home.html", {

        ready: function (element, options) {
            canvasInit();

            canvasObject.canvas.addEventListener("MSPointerMove", home.prototype.moveTouch, true);
            canvasObject.canvas.addEventListener("MSPointerDown", home.prototype.startTouch, false);
            canvasObject.canvas.addEventListener("MSPointerUp", home.prototype.stopTouch, false);

            var clearButton = document.getElementById("clear");
            clearButton.addEventListener("click", home.prototype.clearButtonClickHandler, false);

            var clearButton = document.getElementById("calc");
            clearButton.addEventListener("click", home.prototype.calcButtonClickHandler, false);
        },

        clearButtonClickHandler: function (e) {
            canvasInit();
            canvasObject.context.clearRect(-MARGIN_WIDTH, -MARGIN_HEIGHT, canvasObject.canvas.width, canvasObject.canvas.height);
        },

        calcButtonClickHandler: function (e) {
            var calc = document.getElementById("calorie_field");
            calc.innerText = "5000 kcal";

        },

        startTouch: function (e) {
            canvasObject.drawFlag = true;
            canvasObject.context.beginPath();

            canvasObject.tempPoint.x = e.clientX - MARGIN_WIDTH - 10;
            canvasObject.tempPoint.y = e.clientY - MARGIN_HEIGHT - 10;

            canvasObject.mouseDownPoint.x = e.clientX;
            canvasObject.mouseDownPoint.y = e.clientY;

            fingersOnField++;
        },

        stopTouch: function (e) {
            canvasObject.drawFlag = false;
            canvasObject.context.closePath();

            canvasObject.mouseUpPoint.x = e.clientX;
            canvasObject.mouseUpPoint.y = e.clientY;

            fingersOnField = 0;
        },

        moveTouch: function (e) {
            if (fingersOnField == 1) {
                if ((canvasObject.mouseUpPoint.x == 0 && canvasObject.mouseUpPoint.y == 0) ||
                    (Math.abs(canvasObject.mouseUpPoint.x - e.clientX) < 10 && Math.abs(canvasObject.mouseUpPoint.y - e.clienty) < 10)) {
                    draw(e, canvasObject);
                }
            } else if (fingersOnField == 2) {
                beber(e, canvasObject);
            } else if (fingersOnField == 3) {
                //jump(e, canvasObject);
            }
        }
    });

    function canvasInit() {
        canvasObject.canvas = document.getElementById("mycanvas");
        canvasObject.canvas.width = 1900;
        canvasObject.canvas.height = 1050;

        var calc = document.getElementById("calorie_field");
        calc.innerText = "";

        MARGIN_WIDTH = canvasObject.canvas.width / 2;
        MARGIN_HEIGHT = canvasObject.canvas.height / 2;

        canvasObject.context = canvasObject.canvas.getContext("2d");
        canvasObject.context.translate(canvasObject.canvas.width / 2, canvasObject.canvas.height / 2);

        canvasObject.context.strokeStyle = "rgba(0,0,0,1)";
        canvasObject.context.lineWidth = 5;

        surface.canvas = canvasObject.canvas;
        surface.context = canvasObject.context;

        jumpedFlag = 0;


        surface.basePoints = [];
        surface.altitude = 0;

        canvasObject.tempPoint.x = canvasObject.tempPoint.y = 0;
        canvasObject.mouseDownPoint.x = canvasObject.mouseDownPoint.y = 0;
        canvasObject.mouseUpPoint.x = canvasObject.mouseUpPoint.y = 0;
    }

    function draw(e, drawObject) {
        if (!drawObject.drawFlag) return;

        canvasObject.context.lineWidth = 10;
        var x = e.clientX - MARGIN_WIDTH - 10;
        var y = e.clientY - MARGIN_HEIGHT - 10;

        drawObject.context.moveTo(drawObject.tempX, drawObject.tempY);
        drawObject.context.lineTo(x, y);
        drawObject.context.stroke();

        surface.basePoints.push([x, y, 0]);

        drawObject.tempPoint.x = x;
        drawObject.tempPoint.y = y;
    }

    function beber(e, drawObject) {
        var beberVolume = ((drawObject.mouseDownPoint.y - e.clientY) / canvasObject.canvas.height) * 10000;

        if (rotateTime < ROTATE_MAX) {
            surface.generateHeadPoints();

            surface.xRotate(-1, surface.headPoints);
            surface.xRotate(-1, surface.basePoints);
        } else {
            if (beberVolume > 0) {
                surface.altitude -= 10;
            } else {
                surface.altitude += 10;
            }
            surface.generateHeadPoints();

            surface.xRotate(-1, surface.headPoints);
        }

        rotateTime++;

        canvasObject.context.clearRect(-MARGIN_WIDTH, -MARGIN_HEIGHT, canvasObject.canvas.width, canvasObject.canvas.height);
        surface.draw();
    }

    var jumpedFlag = 0;
    function jump(e, drawObject) {
        var swipeVolume = ((drawObject.mouseDownPoint.y - e.clientX) / canvasObject.canvas.width) * 100;
        if (Math.abs(swipeVolume) > 50 && jumpedFlag == 0) {
            jumpedFlag = 1;
            WinJS.Navigation.navigate("/pages/cal/cal.html");
        }
        console.log(swipeVolume);
    }
}
)();
