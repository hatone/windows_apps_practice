// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511

(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/answer/answer.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            showTheCard();
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });

    function showTheCard() {
        var card = Data.cards[getRandomNumber(Data.cards.length)];
        document.getElementById("answerCardName").innerText = card.name;
        document.getElementById("answerCardMeaning").innerText = card.meaning;
        
        if (getRandomNumber(2) == 0) {
            document.getElementById("answerCardImage").innerHTML = "<img src=\"" + card.imagePath + "\">";
            document.getElementById("answerCardMessage").innerText = card.meaningUpright;
            document.getElementById("answerCardKeywords").innerText = card.keywordUpright;
        } else {
            document.getElementById("answerCardImage").innerHTML = "<img src=\"" + card.imagePath + "\" style=\"transform: rotate(90deg);-ms-transform: rotate(180deg);\">";
            document.getElementById("answerCardMessage").innerText = card.meaningReverse;
            document.getElementById("answerCardKeywords").innerText = card.keywordReverse;
        }

    }

    function getRandomNumber(length) {
        var randnum = Math.floor(Math.random() * length);
        return randnum;
    }
})();
