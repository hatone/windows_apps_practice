(function () {
    "use strict";

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
        }
    };

    function point(x, y, z) {
        return [x, y, z];
    }

    var surface = new Surface();
    var basePoints = [];

    var home = WinJS.UI.Pages.define("/pages/home/home.html", {

        ready: function (element, options) {

            canvasObject.canvas = document.getElementById("mycanvas");
            canvasObject.context = canvasObject.canvas.getContext("2d");
            canvasObject.context.translate(2000 / 2, 800 / 2);

            surface.canvas = canvasObject.canvas;
            surface.context = canvasObject.context;

            canvasObject.context.strokeStyle = "rgba(0,0,0,1)";
            canvasObject.context.lineWidth = 10;

            canvasObject.canvas.addEventListener("MSPointerMove", home.prototype.moveTouch, true);
            canvasObject.canvas.addEventListener("MSPointerDown", home.prototype.startTouch, false);
            canvasObject.canvas.addEventListener("MSPointerUp", home.prototype.stopTouch, false);

            var clearButton = document.getElementById("clear");
            clearButton.addEventListener("click", home.prototype.buttonClickHandler, false);

            var rotateButton = document.getElementById("rotate");
            rotateButton.addEventListener("click", home.prototype.rotateButtonClickHandler, false);
        },

        buttonClickHandler: function (e) {
            basePoints = [];
            surface.basePoints = [];
            surface.headPoints = [];
            canvasObject.context.clearRect(-2000 / 2, -800 / 2, 2000, 800);
        },

        rotateButtonClickHandler: function (e) {
            surface.xRotate(-1);
        },

        startTouch: function (e) {
            canvasObject.drawFlag = true;
            canvasObject.context.beginPath();

            canvasObject.tempPoint.x = e.clientX - 1000;
            canvasObject.tempPoint.y = e.clientY - 175 - 400;

            canvasObject.mouseDownPoint.y = e.clientY;

            canvasObject.fingersOnField++;
        },

        stopTouch: function (e) {
            canvasObject.drawFlag = false;
            canvasObject.context.closePath();

            canvasObject.fingersOnField = 0;
        },

        moveTouch: function (e) {
            if (canvasObject.fingersOnField == 1) {
                draw(e, canvasObject);
            } else if (canvasObject.fingersOnField == 2) {
                beber(e, canvasObject);
            };
        }
    });


    function draw(e, drawObject) {
        if (!drawObject.drawFlag) return;

        var x = e.clientX - 1000;
        var y = e.clientY - 175 - 400;

        drawObject.context.moveTo(drawObject.tempX, drawObject.tempY);
        drawObject.context.lineTo(x, y);
        drawObject.context.stroke();

        basePoints.push(point(x, y, 0));

        drawObject.tempPoint.x = x;
        drawObject.tempPoint.y = y;
    }

    function beber(e, drawObject) {
        var beberVolume = ((drawObject.mouseDownPoint.y - e.clientY) / 600) * 200;
        var headPoints = [];

        for (var i = 0; i < basePoints.length; i++) {
            headPoints.push(point(basePoints[i][0], basePoints[i][1], beberVolume));
        }

        surface.basePoints = basePoints;
        surface.headPoints = headPoints;

        console.log(basePoints.length);
    }
}
)();
