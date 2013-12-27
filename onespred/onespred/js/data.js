(function () {
    "use strict";
    var cardList = new Array();

    WinJS.xhr({ url: "data/resources.txt" }).then(function (xhr) {
        var cards = JSON.parse(xhr.responseText);

        cards.forEach(function (card) {
            cardList.push(card)
        });
    });

    WinJS.Namespace.define("Data", {
        cards: cardList
    });
})();