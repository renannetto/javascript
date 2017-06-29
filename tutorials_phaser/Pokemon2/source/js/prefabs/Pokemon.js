var Pokemon = Pokemon || {};

Pokemon.Pokemon = function (game_state, name, position, properties) {
    "use strict";
    Pokemon.Prefab.call(this, game_state, name, position, properties);
    
    this.BODY_RADIUS = 30;
    this.MESSAGE_PROPERTIES = {
        texture: "message_box_image",
        group: "hud",
        anchor: {x: 0.5, y: 0.5},
        callback: "return_to_world",
        text_properties: {
            text: "",
            group: "hud",
            style: {
                font: "32px Arial",
                fill: "#000"
            }
        }
    };
    
    this.fleeing_rate = properties.fleeing_rate;
    this.species = properties.species;
    this.texture_key = properties.texture;
    
    // initialize Pokemon physical body
    this.game_state.game.physics.p2.enable(this);
    this.body.static = true;
    this.body.setCircle(this.BODY_RADIUS);
    this.body.setCollisionGroup(this.game_state.collision_groups.pokemons);
    this.body.collides([this.game_state.collision_groups.pokeballs]);
};

Pokemon.Pokemon.prototype = Object.create(Pokemon.Prefab.prototype);
Pokemon.Pokemon.prototype.constructor = Pokemon.Pokemon;

Pokemon.Pokemon.prototype.catch = function () {
    "use strict";
    var catch_message;
    // kill the Pokemon and show the catch message box
    this.kill();
    
    if (!this.already_caught()) {    
        this.game_state.game.caught_pokemon.push({species: this.species, texture: this.texture_key});
    }
    
    catch_message = new Pokemon.MessageBox(this.game_state, "catch_message", {x: this.game_state.game.world.centerX, y: this.game_state.game.world.centerY}, this.MESSAGE_PROPERTIES);
    catch_message.message_text.text = "Gotcha!";
};

Pokemon.Pokemon.prototype.fled = function () {
    "use strict";
    var flee_chance, fled, flee_message;
    // check if the Pokemon will flee
    flee_chance = this.game_state.rnd.frac();
    fled = flee_chance < this.fleeing_rate;
    if (fled) {
        // kill the Pokemon and show the fled message box
        this.kill();
        flee_message = new Pokemon.MessageBox(this.game_state, "flee_message", {x: this.game_state.game.world.centerX, y: this.game_state.game.world.centerY}, this.MESSAGE_PROPERTIES);
        flee_message.message_text.text = "You lost it!";
    }
    return fled;
};

Pokemon.Pokemon.prototype.already_caught = function () {
    "use strict";
    var caught = false;
    this.game_state.game.caught_pokemon.forEach(function (pokemon) {
        if (pokemon.species === this.species) {
            caught = true;
        }
    }, this);
    return caught;
};