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

    

    var home = WinJS.UI.Pages.define("/pages/home/home.html", {

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            canvasObject.canvas = document.getElementById("mycanvas");
            canvasObject.context = canvasObject.canvas.getContext("2d");
            canvasObject.context.strokeStyle = "rgba(0,0,0,1)";
            canvasObject.context.lineWidth = 10;

            canvasObject.canvas.addEventListener("MSPointerMove", home.prototype.moveTouch, true);
            canvasObject.canvas.addEventListener("MSPointerDown", home.prototype.startTouch, false);
            canvasObject.canvas.addEventListener("MSPointerUp", home.prototype.stopTouch, false);

            var clearButton = document.getElementById("clear");
            clearButton.addEventListener("click", home.prototype.buttonClickHandler, false);
        },

        buttonClickHandler: function (e) {
            canvasObject.context.clearRect(0, 0, 1700, 800);
        },

        startTouch: function (e) {
            canvasObject.drawFlag = true;
            canvasObject.context.beginPath();

            canvasObject.tempPoint.x = e.clientX;
            canvasObject.tempPoint.y = e.clientY - 175;

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

        var x = e.clientX;
        var y = e.clientY - 175;

        drawObject.context.moveTo(drawObject.tempX, drawObject.tempY);
        drawObject.context.lineTo(x, y);
        drawObject.context.stroke();

        drawObject.tempPoint.x = x;
        drawObject.tempPoint.y = y;
    }

    function beber(e, drawObject) {
        var beberVolume = ((drawObject.mouseDownPoint.y - e.clientY) / 800) * 100
        drawObject.context.lineWidth = beberVolume;
    }

}
)();
