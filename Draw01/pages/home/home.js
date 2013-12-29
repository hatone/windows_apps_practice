(function () {
    "use strict";
    var drawFlag = false;
    var oldX = 0;
    var oldY = 0;
    var canvas = null;
    var context = null;

    var home = WinJS.UI.Pages.define("/pages/home/home.html", {
        
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            canvas = document.getElementById("mycanvas");
            context = canvas.getContext("2d");
            context.strokeStyle = "rgba(0,0,0,1)";
            context.lineWidth = 10;

            canvas.addEventListener("MSPointerMove", home.prototype.draw, true);
            canvas.addEventListener("MSPointerDown", home.prototype.startDraw, false);
            canvas.addEventListener("MSPointerUp", home.prototype.stopDraw, false);

            var clearButton = document.getElementById("clear");
            clearButton.addEventListener("click", home.prototype.buttonClickHandler, false);
        },

        draw: function (e) {
            console.log("mouse move");
            if (!drawFlag) return;
            var x = e.clientX;
            var y = e.clientY - 175;

            context.moveTo(oldX, oldY);
            context.lineTo(x, y);
            context.stroke();
            
            oldX = x;
            oldY = y;
        },
        
        startDraw: function (e) {
            console.log("mouse down");
            drawFlag = true;
            context.beginPath();

            oldX = e.clientX;
            oldY = e.clientY - 175;
        },

        stopDraw: function (e) {
            console.log("mouse up");
            drawFlag = false;
            context.closePath();
        },

        buttonClickHandler: function (e) {
            context.clearRect(0, 0, 1700, 800);
        }

    });
    }
)();
