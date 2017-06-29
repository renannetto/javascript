var Phaserstone = Phaserstone || {};

Phaserstone.place_prefabs_in_region = function (prefabs, region) {
    "use strict";
    var space_per_prefab, space_between_prefabs, prefab_position;
    space_per_prefab = region.width / prefabs.length;
    space_between_prefabs = space_per_prefab - prefabs[0].width;
    prefab_position = {x: region.x + (space_between_prefabs / 2), y: region.y};
    prefabs.forEach(function (prefab) {
        prefab.x = prefab_position.x;
        prefab.y = prefab_position.y;
        prefab_position.x += space_per_prefab;
    }, this);
};