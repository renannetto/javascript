var Pokemon = Pokemon || {};

Pokemon.CatchState = function () {
    "use strict";
    Pokemon.JSONLevelState.call(this);
    
    this.prefab_classes = {
        "background": Pokemon.Prefab.prototype.constructor,
        "pokeball": Pokemon.Pokeball.prototype.constructor,
        "pokemon": Pokemon.Pokemon.prototype.constructor,
        "button": Pokemon.Button.prototype.constructor
    };
};

Pokemon.CatchState.prototype = Object.create(Pokemon.JSONLevelState.prototype);
Pokemon.CatchState.prototype.constructor = Pokemon.CatchState;

Pokemon.CatchState.prototype.init = function (level_data, extra_parameters) {
    "use strict";
    Pokemon.JSONLevelState.prototype.init.call(this, level_data, extra_parameters);
    
    // start physics system
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.arcade.gravity.y = 0;
    
    this.pokemon_properties = extra_parameters.pokemon_properties;
};

Pokemon.CatchState.prototype.create = function () {
    "use strict";
    var pokemon_data;
    
    this.collision_groups = {};
    this.level_data.collision_groups.forEach(function (collision_group_name) {
        this.collision_groups[collision_group_name] = this.game.physics.p2.createCollisionGroup();
    }, this);
    
    Pokemon.JSONLevelState.prototype.create.call(this);
    
    pokemon_data = {
        type: "pokemon",
        position: {x: 0.5, y: 0.6},
        properties: this.pokemon_properties
    }
    this.create_prefab("pokemon", pokemon_data);
    
    this.pokeball_types = ["pokeball", "greatball", "ultraball"];
    this.current_pokeball_index = 0;
    this.prefabs[this.pokeball_types[this.current_pokeball_index]].enable(true);
};

Pokemon.CatchState.prototype.return_to_world = function () {
    "use strict";
    this.game.state.start("BootState", true, false, "assets/levels/world_level.json", "WorldState");
};

Pokemon.CatchState.prototype.switch_pokeball = function () {
    "use strict";
    this.prefabs[this.pokeball_types[this.current_pokeball_index]].enable(false);
    this.current_pokeball_index = (this.current_pokeball_index + 1) % this.pokeball_types.length;
    this.prefabs[this.pokeball_types[this.current_pokeball_index]].enable(true);
};
