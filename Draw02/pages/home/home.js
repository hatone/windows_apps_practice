(function () {
    "use strict";

    var MARGIN_WIDTH;
    var MARGIN_HEIGHT;

    var canvasObject = {
        canvas: null,
        context: null,
        drawFlag: false,
        fingersOnField: 0,
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

    var surface = new Surface();

    var home = WinJS.UI.Pages.define("/pages/home/home.html", {

        ready: function (element, options) {
            canvasInit();

            canvasObject.canvas.addEventListener("MSPointerMove", home.prototype.moveTouch, true);
            canvasObject.canvas.addEventListener("MSPointerDown", home.prototype.startTouch, false);
            canvasObject.canvas.addEventListener("MSPointerUp", home.prototype.stopTouch, false);

            var clearButton = document.getElementById("clear");
            clearButton.addEventListener("click", home.prototype.clearButtonClickHandler, false);

            var rotateButton = document.getElementById("rotate");
            rotateButton.addEventListener("click", home.prototype.rotateButtonClickHandler, false);
        },

        clearButtonClickHandler: function (e) {
            surface.basePoints = [];
            surface.altitude = 0;

            canvasObject.tempPoint.x = canvasObject.tempPoint.y = 0;
            canvasObject.mouseDownPoint.x = canvasObject.mouseDownPoint.y = 0;
            canvasObject.mouseUpPoint.x = canvasObject.mouseUpPoint.y = 0;

            canvasObject.context.clearRect(-MARGIN_WIDTH, -MARGIN_HEIGHT, canvasObject.canvas.width, canvasObject.canvas.height);
        },

        rotateButtonClickHandler: function (e) {
            surface.xRotate(-1);
        },

        startTouch: function (e) {
            canvasObject.drawFlag = true;
            canvasObject.context.beginPath();

            canvasObject.tempPoint.x = e.clientX - MARGIN_WIDTH;
            canvasObject.tempPoint.y = e.clientY - MARGIN_HEIGHT -175;

            canvasObject.mouseDownPoint.x = e.clientX;
            canvasObject.mouseDownPoint.y = e.clientY;

            canvasObject.fingersOnField++;
        },

        stopTouch: function (e) {
            canvasObject.drawFlag = false;
            canvasObject.context.closePath();

            canvasObject.mouseUpPoint.x = e.clientX;
            canvasObject.mouseUpPoint.y = e.clientY;

            canvasObject.fingersOnField = 0;
        },

        moveTouch: function (e) {
            if (canvasObject.fingersOnField == 1) {
                if ((canvasObject.mouseUpPoint.x == 0 && canvasObject.mouseUpPoint.y == 0) ||
                    (Math.abs(canvasObject.mouseUpPoint.x - e.clientX) < 10 && Math.abs(canvasObject.mouseUpPoint.y - e.clienty) < 10)) {
                    draw(e, canvasObject);
                }
            } else if (canvasObject.fingersOnField == 2) {
                beber(e, canvasObject);
            };
        }
    });

    function canvasInit() {
        canvasObject.canvas = document.getElementById("mycanvas");
        canvasObject.canvas.width = 2000;
        canvasObject.canvas.height = 800;

        MARGIN_WIDTH = canvasObject.canvas.width / 2;
        MARGIN_HEIGHT = canvasObject.canvas.height / 2;

        canvasObject.context = canvasObject.canvas.getContext("2d");
        canvasObject.context.translate(canvasObject.canvas.width / 2, canvasObject.canvas.height / 2);

        canvasObject.context.strokeStyle = "rgba(0,0,0,1)";
        canvasObject.context.lineWidth = 10;

        surface.canvas = canvasObject.canvas;
        surface.context = canvasObject.context;
    }

    function draw(e, drawObject) {
        if (!drawObject.drawFlag) return;

        canvasObject.context.lineWidth = 10;
        var x = e.clientX - MARGIN_WIDTH;
        var y = e.clientY - MARGIN_HEIGHT - 175; 

        drawObject.context.moveTo(drawObject.tempX, drawObject.tempY);
        drawObject.context.lineTo(x, y);
        drawObject.context.stroke();

        surface.basePoints.push([x, y, 0]);

        drawObject.tempPoint.x = x;
        drawObject.tempPoint.y = y;
    }

    function beber(e, drawObject) {
        var beberVolume = ((drawObject.mouseDownPoint.y - e.clientY) / canvasObject.canvas.height) * 1000;
        surface.altitude = beberVolume;
    }
}
)();
