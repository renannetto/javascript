var Pokemon = Pokemon || {};

Pokemon.PokemonSpawn = function (game_state, name, position, properties) {
    "use strict";
    Pokemon.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.25);
    this.scale.setTo(0.25);
    
    this.duration = properties.duration;
    this.detection_radius = properties.detection_radius;
    this.pokemon_properties = properties.pokemon_properties;
    
    this.visible = false;
    
    this.add_kill_event();
    
    // add input event to try catching this Pokemon
    this.events.onInputDown.add(this.try_catching, this);
};

Pokemon.PokemonSpawn.prototype = Object.create(Pokemon.Prefab.prototype);
Pokemon.PokemonSpawn.prototype.constructor = Pokemon.PokemonSpawn;

Pokemon.PokemonSpawn.prototype.add_kill_event = function () {
    "use strict";
    var duration;
    duration = this.game_state.rnd.between(this.duration.min, this.duration.max);
    this.kill_timer = this.game_state.time.create();
    this.kill_timer.add(Phaser.Timer.SECOND * duration, this.kill, this);
};

Pokemon.PokemonSpawn.prototype.update = function () {
    "use strict";
    var distance_to_trainer, trainer_within_detection_radius;
    distance_to_trainer = this.position.distance(this.game_state.prefabs.trainer.position);
    trainer_within_detection_radius = distance_to_trainer <= this.detection_radius;
    this.visible = trainer_within_detection_radius;
    this.inputEnabled = trainer_within_detection_radius;
};

Pokemon.PokemonSpawn.prototype.try_catching = function () {
    "use strict";
    // start CatchState
    this.game_state.game.state.start("BootState", true, false, "assets/levels/catch_level.json", "CatchState", {pokemon_properties: this.pokemon_properties});
};