var Pokemon = Pokemon || {};

Pokemon.Pokestop = function (game_state, name, position, properties) {
    "use strict";
    var text_position;
    Pokemon.Prefab.call(this, game_state, name, position, properties);
    
    this.INITIAL_POKEBALL_POSITION = new Phaser.Point(this.game_state.game.width - 50, 50);
    this.POKEBALL_TIME = 2;
    
    this.reset_time = +properties.reset_time;
    this.detection_radius = +properties.detection_radius;
    
    this.events.onInputDown.add(this.get_pokeballs, this);
    
    this.reset_timer = this.game_state.game.time.create(false);
};

Pokemon.Pokestop.prototype = Object.create(Pokemon.Prefab.prototype);
Pokemon.Pokestop.prototype.constructor = Pokemon.Pokestop;

Pokemon.Pokestop.prototype.update = function () {
    "use strict";
    var distance_to_trainer, trainer_within_detection_radius;
    distance_to_trainer = this.position.distance(this.game_state.prefabs.trainer.position);
    trainer_within_detection_radius = distance_to_trainer <= this.detection_radius;
    this.inputEnabled = trainer_within_detection_radius;
};

Pokemon.Pokestop.prototype.get_pokeballs = function () {
    "use strict";
    var number_of_pokeballs, pokeball_index, pokeball, pokeballs_to_show;
    
    this.tint = 0xff0000;
    
    number_of_pokeballs = Pokemon.choose_randomly(this.game_state.rnd, this.game_state.pokeball_probabilities.number_of_pokeballs);
    
    pokeballs_to_show = [];
    for (pokeball_index = 0; pokeball_index < number_of_pokeballs.number; pokeball_index += 1) {
        pokeball = Pokemon.choose_randomly(this.game_state.rnd, this.game_state.pokeball_probabilities.type_of_pokeball);
        this.game_state.game.number_of_pokeballs[pokeball.type] += 1;
        pokeballs_to_show.push(pokeball.type);
    }
    
    // update database
    firebase.database().ref("/users/" + firebase.auth().currentUser.uid + "/number_of_pokeballs").set(this.game_state.game.number_of_pokeballs);

    this.inputEnabled = false;
    
    this.show_pokeballs(pokeballs_to_show);
    
    this.reset_timer.add(this.reset_time * Phaser.Timer.SECOND, this.reset_pokestop, this);
    this.reset_timer.start();
};

Pokemon.Pokestop.prototype.show_pokeballs = function (pokeballs_to_show) {
    "use strict";
    var pokeball_index, pokeball_position, pokeball, pokeball_kill_timer;
    pokeball_position = new Phaser.Point(this.INITIAL_POKEBALL_POSITION.x, this.INITIAL_POKEBALL_POSITION.y);
    pokeball_kill_timer = this.game_state.game.time.create();
    pokeballs_to_show.forEach(function(pokeball_type) {
        pokeball = new Phaser.Sprite(this.game_state.game, pokeball_position.x, pokeball_position.y, pokeball_type + "_image");
        pokeball.anchor.setTo(0.5);
        pokeball.scale.setTo(0.3);
        this.game_state.groups.hud.add(pokeball);
        
        pokeball_kill_timer.add(this.POKEBALL_TIME * Phaser.Timer.SECOND, pokeball.kill, pokeball);
        
        pokeball_position.y += 1.5*pokeball.height;
    }, this);
    pokeball_kill_timer.start();
};

Pokemon.Pokestop.prototype.reset_pokestop = function () {
    "use strict";
    this.inputEnabled = true;
    this.tint = 0xffffff;
    this.reset_timer.stop();
};