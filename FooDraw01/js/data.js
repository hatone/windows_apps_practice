(function () {
    "use strict";

    var foodList = new WinJS.Binding.List();
    var groupedFoods = foodList.createGrouped(
        function groupKeySelector(food) { return food.group.key; },
        function groupDataSelector(food) { return food.group; }
    );

    WinJS.xhr({ url: "/data/foods.json" }).then(function (xhr) {
        var foods = JSON.parse(xhr.responseText);

        foods.forEach(function (food) {
            foodList.push(food)
        });
    });

    WinJS.Namespace.define("Data", {
        items: groupedFoods,
        groups: groupedFoods.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(food) {
        return [food.group.key, food.name];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return foodList.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        return groupedFoods.groups.getItemFromKey(key).data;
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedFoods.length; i++) {
            var item = groupedFoods.getAt(i);
            if (item.group.key === reference[0] && item.name === reference[1]) {
                return item;
            }
        }
    }


})();
