var PathfindingExample = PathfindingExample || {};

PathfindingExample.WorldState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.prefab_classes = {
        "player": PathfindingExample.Player.prototype.constructor
    };
};

PathfindingExample.WorldState.prototype = Object.create(Phaser.State.prototype);
PathfindingExample.WorldState.prototype.constructor = PathfindingExample.WorldState;

PathfindingExample.WorldState.prototype.init = function (level_data) {
    "use strict";
    var tileset_index, tile_dimensions;
    this.level_data = this.level_data || level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 0;
    
    // create map and set tileset
    this.map = this.game.add.tilemap(this.level_data.map.key);
    tileset_index = 0;
    this.map.tilesets.forEach(function (tileset) {
        this.map.addTilesetImage(tileset.name, this.level_data.map.tilesets[tileset_index]);
        tileset_index += 1;
    }, this);
    
    // initialize pathfinding
    tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
    this.pathfinding = this.game.plugins.add(PathfindingExample.Pathfinding, this.map.layers[1].data, [-1], tile_dimensions);
};

PathfindingExample.WorldState.prototype.create = function () {
    "use strict";
    var group_name, object_layer, collision_tiles;
    
    // create map layers
    this.layers = {};
    this.map.layers.forEach(function (layer) {
        this.layers[layer.name] = this.map.createLayer(layer.name);
        if (layer.properties.collision) { // collision layer
            collision_tiles = [];
            layer.data.forEach(function (data_row) { // find tiles used in the layer
                data_row.forEach(function (tile) {
                    // check if it's a valid tile index and isn't already in the list
                    if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                        collision_tiles.push(tile.index);
                    }
                }, this);
            }, this);
            this.map.setCollision(collision_tiles, true, layer.name);
        }
    }, this);
    // resize the world to be the size of the current layer
    this.layers[this.map.layer.name].resizeWorld();
    
    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);
    
    this.prefabs = {};
    
    for (object_layer in this.map.objects) {
        if (this.map.objects.hasOwnProperty(object_layer)) {
            // create layer objects
            this.map.objects[object_layer].forEach(this.create_object, this);
        }
    }
    
    // add user input to move player
    this.game.input.onDown.add(this.move_player, this);
};

PathfindingExample.WorldState.prototype.create_object = function (object) {
    "use strict";
    var object_y, position, prefab;
    // tiled coordinates starts in the bottom left corner
    object_y = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2);
    position = {"x": object.x + (this.map.tileHeight / 2), "y": object_y};
    // create object according to its type
    if (this.prefab_classes.hasOwnProperty(object.type)) {
        prefab = new this.prefab_classes[object.type](this, object.name, position, object.properties);
    }
    this.prefabs[object.name] = prefab;
};

PathfindingExample.WorldState.prototype.move_player = function () {
    "use strict";
    var target_position;
    target_position = new Phaser.Point(this.game.input.activePointer.x, this.game.input.activePointer.y);
    
    this.prefabs.player.move_to(target_position);
};

PathfindingExample.WorldState.prototype.render = function () {
    "use strict";
    this.game.debug.body(this.prefabs.player);
};
