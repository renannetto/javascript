var Tactics = Tactics || {};

Tactics.TiledState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.prefab_classes = {
        "unit": Tactics.Unit.prototype.constructor,
        "command_item": Tactics.CommandItem.prototype.constructor,
        "menu": Tactics.Menu.prototype.constructor,
        "place_region": Tactics.PlaceRegion.prototype.constructor,
        "unit_sprite": Tactics.Prefab.prototype.constructor
    };
};

Tactics.TiledState.prototype = Object.create(Phaser.State.prototype);
Tactics.TiledState.prototype.constructor = Tactics.TiledState;

Tactics.TiledState.prototype.init = function (level_data) {
    "use strict";
    var tileset_index;
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 0;
    
    this.map = this.game.add.tilemap(level_data.map.key);
    tileset_index = 0;
    this.map.tilesets.forEach(function (tileset) {
        this.map.addTilesetImage(tileset.name, level_data.map.tilesets[tileset_index]);
        tileset_index += 1;
    }, this);
};

Tactics.TiledState.prototype.create = function () {
    "use strict";
    var group_name, object_layer, collision_tiles, world_grid, tile_dimensions, prefab_name;
    
    this.layers = {};
    this.map.layers.forEach(function (layer) {
        this.layers[layer.name] = this.map.createLayer(layer.name);
        if (layer.properties.collision) {
            this.map.setCollisionByExclusion([-1], true, layer.name);
        }
    }, this);
    this.layers[this.map.layer.name].resizeWorld();
    
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);
    
    this.prefabs = {};
    for (object_layer in this.map.objects) {
        if (this.map.objects.hasOwnProperty(object_layer)) {
            this.map.objects[object_layer].forEach(this.create_object, this);
        }
    }
    for (prefab_name in this.level_data.prefabs) {
        if (this.level_data.prefabs.hasOwnProperty(prefab_name)) {
            this.create_prefab(prefab_name, this.level_data.prefabs[prefab_name], this.level_data.prefabs[prefab_name].position);
        }
    }
};

Tactics.TiledState.prototype.create_object = function (object) {
    "use strict";
    var object_y, object_x, position;
    object_y = object.y - (this.map.tileHeight / 2);
    object_x = object.x + (this.map.tileWidth / 2);
    position = {x: object_x, y: object_y};
    this.create_prefab(object.name, object, position);
};

Tactics.TiledState.prototype.create_prefab = function (prefab_name, prefab_data, position) {
    "use strict";
    var prefab;
    if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
        prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, position, prefab_data.properties);
    }
    this.prefabs[prefab_name] = prefab;
    return prefab;
};

Tactics.TiledState.prototype.find_prefab_in_tile = function (group, position) {
    "use strict";
    var found_prefab;
    this.groups[group].forEach(function (prefab) {
        if (prefab.x === position.x && prefab.y === position.y) {
            found_prefab = prefab;
        }
    }, this);
    return found_prefab;
};