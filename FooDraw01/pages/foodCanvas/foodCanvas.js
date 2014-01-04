(function () {
    "use strict";

    var MARGIN_WIDTH;
    var MARGIN_HEIGHT;
    var ROTATE_MAX = 20;

    var canvasObject = {
        canvas: null,
        context: null,
        item: null,
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
    var home = WinJS.UI.Pages.define("/pages/foodCanvas/foodCanvas.html", {

        ready: function (element, options) {
            var item = Data.resolveItemReference(options.item);
            element.querySelector(".titlearea .pagetitle").textContent = item.name;

            canvasObject.item = item;
            canvasInit();

            canvasObject.canvas.addEventListener("MSPointerMove", home.prototype.moveTouch, true);
            canvasObject.canvas.addEventListener("MSPointerDown", home.prototype.startTouch, false);
            canvasObject.canvas.addEventListener("MSPointerUp", home.prototype.stopTouch, false);

            var clearButton = document.getElementById("clear");
            clearButton.addEventListener("click", home.prototype.clearButtonClickHandler, false);

            var calcButton = document.getElementById("calc");
            calcButton.addEventListener("click", home.prototype.calcButtonClickHandler, false);
        },

        clearButtonClickHandler: function (e) {
            canvasInit();
            canvasObject.context.clearRect(-MARGIN_WIDTH, -MARGIN_HEIGHT, canvasObject.canvas.width, canvasObject.canvas.height);
        },

        calcButtonClickHandler: function (e) {
            infillPoints();
            var calc = document.getElementById("calorie_field");
            calc.innerText = area + " kcal";

        },

        startTouch: function (e) {
            canvasObject.drawFlag = true;
            canvasObject.context.beginPath();

            canvasObject.tempPoint.x = e.clientX - MARGIN_WIDTH - 10;
            canvasObject.tempPoint.y = e.clientY - MARGIN_HEIGHT - 10 - 130;

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
                    pushPoints(e, canvasObject);
                }
                draw(e, canvasObject);

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
        canvasObject.canvas.height = 900;

        var calc = document.getElementById("calorie_field");
        calc.innerText = "";

        MARGIN_WIDTH = canvasObject.canvas.width / 2;
        MARGIN_HEIGHT = canvasObject.canvas.height / 2;

        canvasObject.context = canvasObject.canvas.getContext("2d");
        canvasObject.context.translate(canvasObject.canvas.width / 2, canvasObject.canvas.height / 2);

        canvasObject.context.strokeStyle = "rgba(" + canvasObject.item.color.red + "," + canvasObject.item.color.green + "," + canvasObject.item.color.blue + ", 1)";
        canvasObject.context.lineWidth = 5;

        surface.canvas = canvasObject.canvas;
        surface.context = canvasObject.context;

        jumpedFlag = 0;
        rotateTime = 0;

        surface.basePoints = [];
        surface.altitude = 0;

        canvasObject.tempPoint.x = canvasObject.tempPoint.y = 0;
        canvasObject.mouseDownPoint.x = canvasObject.mouseDownPoint.y = 0;
        canvasObject.mouseUpPoint.x = canvasObject.mouseUpPoint.y = 0;

        area = 0;
    }

    function draw(e, drawObject) {
        if (!drawObject.drawFlag) return;

        canvasObject.context.lineWidth = 10;
        var x = e.clientX - MARGIN_WIDTH - 10;
        var y = e.clientY - MARGIN_HEIGHT - 10 - 130;

        drawObject.context.moveTo(drawObject.tempX, drawObject.tempY);
        drawObject.context.lineTo(x, y);
        drawObject.context.stroke();

        drawObject.tempPoint.x = x;
        drawObject.tempPoint.y = y;

    }

    function pushPoints(e, drawObject) {
        var x = e.clientX - MARGIN_WIDTH - 10;
        var y = e.clientY - MARGIN_HEIGHT - 10 - 130;
        
        surface.basePoints.push([x, y, 0]);
    }

    function beber(e, drawObject) {
        var beberVolume = ((drawObject.mouseDownPoint.y - e.clientY) / canvasObject.canvas.height) * 10000;

        if (surface.initialPoints.length == 0) {
            surface.storeInitialPoints();
        }

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

    var area = 0;
    function infillPoints() {
        var basePoints = surface.initialPoints;
        area = 0;
        var dx = 0;
        var dy = 0;

        for (var i = 0; i < basePoints.length; i++) {
            if (i < basePoints.length - 1) {
                area += ( basePoints[i][0]*basePoints[i + 1][1] - basePoints[i + 1][0] *basePoints[i][1])
            } else {
                area += (basePoints[i][0] * basePoints[0][1] - basePoints[0][0] * basePoints[i][1])
            }
        }
        area = Math.abs(parseInt(area / 200) * surface.altitude/1000);
    }
}
)();
