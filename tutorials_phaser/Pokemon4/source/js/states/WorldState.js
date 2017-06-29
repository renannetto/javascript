var Pokemon = Pokemon || {};

Pokemon.WorldState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.prefab_classes = {
        "pokemon_spawner": Pokemon.PokemonSpawner.prototype.constructor,
        "trainer": Pokemon.Trainer.prototype.constructor,
        "pokedex": Pokemon.Pokedex.prototype.constructor,
        "pokedex_button": Pokemon.Button.prototype.constructor,
        "pokestop": Pokemon.Pokestop.prototype.constructor
    };
};

Pokemon.WorldState.prototype = Object.create(Phaser.State.prototype);
Pokemon.WorldState.prototype.constructor = Pokemon.WorldState;

Pokemon.WorldState.prototype.init = function (level_data) {
    "use strict";
    var tileset_index;
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    // start physics system
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.arcade.gravity.y = 0;
    
    // create map and set tileset
    this.map = this.game.add.tilemap(level_data.map.key);
    tileset_index = 0;
    this.map.tilesets.forEach(function (tileset) {
        this.map.addTilesetImage(tileset.name, level_data.map.tilesets[tileset_index]);
        tileset_index += 1;
    }, this);
};

Pokemon.WorldState.prototype.preload = function () {
    "use strict";
    this.load.text("pokemon_probabilities", this.level_data.pokemon_probabilities);
    this.load.text("pokeball_probabilities", this.level_data.pokeball_probabilities);
};

Pokemon.WorldState.prototype.create = function () {
    "use strict";
    var group_name, object_layer, collision_tiles;
    
    // create map layers
    this.layers = {};
    this.map.layers.forEach(function (layer) {
        this.layers[layer.name] = this.map.createLayer(layer.name);
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
    
    this.pokemon_probabilities = JSON.parse(this.game.cache.getText("pokemon_probabilities"));
    this.pokeball_probabilities = JSON.parse(this.game.cache.getText("pokeball_probabilities"));
};

Pokemon.WorldState.prototype.create_object = function (object) {
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

Pokemon.WorldState.prototype.show_pokedex = function () {
    "use strict";
    this.prefabs.pokedex.show();
};
