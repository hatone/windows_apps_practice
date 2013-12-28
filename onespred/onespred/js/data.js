(function () {
    "use strict";
    var cardList = new Array();

    WinJS.xhr({ url: "https://gist.github.com/hatone/a5cc1dba8d9709110eff/raw/6d4c2a7581c3a744b232dfdca0bbda5cca5baebd/resources.txt" }).then(function (xhr) {
        var cards = JSON.parse(xhr.responseText);

        cards.forEach(function (card) {
            cardList.push(card)
        });
    });

    WinJS.Namespace.define("Data", {
        cards: cardList
    });
})();