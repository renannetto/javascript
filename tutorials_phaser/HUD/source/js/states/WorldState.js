var HUDExample = HUDExample || {};

HUDExample.WorldState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.MAP_KEY = "room_tilemap";
    this.MAP_TILESET = "dungeon_tileset";
    
    this.prefab_classes = {
        "hero": HUDExample.Hero.prototype.constructor,
        "item": HUDExample.Item.prototype.constructor,
        "show_stat_with_sprite": HUDExample.ShowStatWithSprite.prototype.constructor,
        "show_stat_with_text": HUDExample.ShowStatWithText.prototype.constructor,
        "show_stat_with_bar": HUDExample.ShowStatWithBar.prototype.constructor
    };
};

HUDExample.WorldState.prototype = Object.create(Phaser.State.prototype);
HUDExample.WorldState.prototype.constructor = HUDExample.WorldState;

HUDExample.WorldState.prototype.init = function (level_data, extra_parameters) {
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

HUDExample.WorldState.prototype.create = function () {
    "use strict";
    var group_name, object_layer, collision_tiles;
    
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
    
    // initialize the HUD plugin
    this.hud = this.game.plugins.add(HUDExample.HUD, this, this.level_data.hud);
    
    // set the camera to follow the hero
    this.game.camera.follow(this.prefabs.hero);
};

HUDExample.WorldState.prototype.create_object = function (object) {
    "use strict";
    var object_y, position;
    // tiled coordinates starts in the bottom left corner
    object_y = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2);
    position = {"x": object.x + (this.map.tileHeight / 2), "y": object_y};
    this.create_prefab(object.type, object.name, position, object.properties);
};

HUDExample.WorldState.prototype.create_prefab = function (type, name, position, properties) {
    "use strict";
    var prefab;
    // create prefab according to its type
    if (this.prefab_classes.hasOwnProperty(type)) {
        prefab = new this.prefab_classes[type](this, name, position, properties);
    }
    this.prefabs[name] = prefab;
    return prefab;
};