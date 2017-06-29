var Pokemon = Pokemon || {};

Pokemon.PokemonSpawn = function (game_state, name, position, properties) {
    "use strict";
    Pokemon.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    this.scale.setTo(0.5);
    
    // add input event to try catching this Pokemon
    this.inputEnabled = true;
    this.events.onInputDown.add(this.try_catching, this);
};

Pokemon.PokemonSpawn.prototype = Object.create(Pokemon.Prefab.prototype);
Pokemon.PokemonSpawn.prototype.constructor = Pokemon.PokemonSpawn;

Pokemon.PokemonSpawn.prototype.try_catching = function () {
    "use strict";
    // start CatchState
    this.game_state.game.state.start("BootState", true, false, "assets/levels/catch_level.json", "CatchState");
};