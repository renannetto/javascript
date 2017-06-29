var Bomberboy = Bomberboy || {};

Bomberboy.TiledState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.prefab_classes = {
        "player": Bomberboy.Player.prototype.constructor,
        "enemy": Bomberboy.Enemy.prototype.constructor,
        "following_enemy": Bomberboy.FollowingEnemy.prototype.constructor,
        "lives": Bomberboy.Lives.prototype.constructor,
        "target": Bomberboy.Target.prototype.constructor
    };
};

Bomberboy.TiledState.prototype = Object.create(Phaser.State.prototype);
Bomberboy.TiledState.prototype.constructor = Bomberboy.TiledState;

Bomberboy.TiledState.prototype.init = function (level_data) {
    "use strict";
    var tileset_index;
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 0;
    
    // create map and set tileset
    this.map = this.game.add.tilemap(level_data.map.key);
    tileset_index = 0;
    this.map.tilesets.forEach(function (tileset) {
        this.map.addTilesetImage(tileset.name, level_data.map.tilesets[tileset_index]);
        tileset_index += 1;
    }, this);
};

Bomberboy.TiledState.prototype.create = function () {
    "use strict";
    var group_name, object_layer, collision_tiles, tile_dimensions, world_grid;
    
    // create map layers
    this.layers = {};
    this.map.layers.forEach(function (layer) {
        this.layers[layer.name] = this.map.createLayer(layer.name);
        if (layer.properties.collision) { // collision layer
            this.map.setCollisionByExclusion([-1], true, layer.name);
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
    
    this.game.user_input = this.game.plugins.add(Bomberboy.UserInput, this, JSON.parse(this.game.cache.getText("user_input")));

    world_grid = this.create_world_grid();
    tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
    this.pathfinding = this.game.plugins.add(Bomberboy.Pathfinding, world_grid, [-1], tile_dimensions);
};

Bomberboy.TiledState.prototype.create_object = function (object) {
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

Bomberboy.TiledState.prototype.create_world_grid = function () {
    "use strict";
    var walls_layer, blocks_layer, row_index, column_index, world_grid;
    walls_layer = this.map.layers[1];
    blocks_layer = this.map.layers[2];
    world_grid = [];
    for (row_index = 0; row_index < this.map.height; row_index += 1) {
        world_grid.push([]);
        for (column_index = 0; column_index < this.map.width; column_index += 1) {
            if (walls_layer.data[row_index][column_index].index === -1 && blocks_layer.data[row_index][column_index].index === -1) {
                world_grid[row_index].push(-1);
            } else {
                if (walls_layer.data[row_index][column_index].index === -1) {
                    world_grid[row_index].push(blocks_layer.data[row_index][column_index].index);
                } else {
                    world_grid[row_index].push(walls_layer.data[row_index][column_index].index);
                }
            }
        }
    }
    return world_grid;
};

Bomberboy.TiledState.prototype.game_over = function () {
    "use strict";
    this.game.state.start("BootState", true, false, "assets/levels/level1.json", "TiledState");
};

Bomberboy.TiledState.prototype.next_level = function () {
    "use strict";
    this.game.state.start("BootState", true, false, this.level_data.next_level, "TiledState");
};
