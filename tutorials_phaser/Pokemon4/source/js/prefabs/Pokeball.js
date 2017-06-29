var Pokemon = Pokemon || {};

Pokemon.Pokeball = function (game_state, name, position, properties) {
    "use strict";
    var text_position;
    Pokemon.Prefab.call(this, game_state, name, position, properties);
    
    this.TWEEN_DURATION = 0.5;
    this.THROW_THRESHOLD = 50;
    this.TEXT_PROPERTIES = {
        text: "",
        group: "hud",
        style: {
            font: "14px Arial",
            fill: "#000"
        }
    };
    
    this.pokeball_speed = properties.pokeball_speed;
    this.catching_rate = properties.catching_rate;
    this.type = properties.type;
    
    this.dragging = false;
    
    this.initial_position = {x: this.x, y: this.y};
    
    // add input events to drag and throw the pokeball
    this.events.onInputDown.add(this.drag, this);
    this.events.onInputUp.add(this.throw, this);

    this.events.onOutOfBounds.add(this.back_to_center, this);
    
    text_position = new Phaser.Point(this.x, this.y + this.height * 0.7);
    this.number_of_pokeballs_text = new Pokemon.TextPrefab(this.game_state, "number_of_pokeballs", text_position, this.TEXT_PROPERTIES);
    this.number_of_pokeballs_text.text = this.game_state.game.number_of_pokeballs[this.type];
    
    if (this.game_state.game.number_of_pokeballs[this.type] === 0) {
        this.alpha = 0.5;
    }
    
    this.enable(false);
};

Pokemon.Pokeball.prototype = Object.create(Pokemon.Prefab.prototype);
Pokemon.Pokeball.prototype.constructor = Pokemon.Pokeball;

Pokemon.Pokeball.prototype.update = function () {
    "use strict";
    // if the pokeball is being dragged, update its position to follow the active pointer
    if (this.dragging) {
        this.x = this.game_state.game.input.activePointer.x;
        this.y = this.game_state.game.input.activePointer.y;
    }
};

Pokemon.Pokeball.prototype.reset = function (x, y) {
    "use strict";
    Phaser.Sprite.prototype.reset.call(this, x, y);
    
    if (this.game_state.game.number_of_pokeballs[this.type] === 0) {
        this.alpha = 0.5;
    }
    
    if (this.game_state.game.number_of_pokeballs.pokeball +
            this.game_state.game.number_of_pokeballs.greatball +
            this.game_state.game.number_of_pokeballs.ultraball === 0) {
        this.game_state.return_to_world();
    }
};

Pokemon.Pokeball.prototype.init_body = function () {
    "use strict";
    this.game_state.game.physics.p2.enable(this);
    this.body.setCircle(this.width / 2);
    this.body.setCollisionGroup(this.game_state.collision_groups.pokeballs);
    this.body.collides([this.game_state.collision_groups.pokemons]);
    // start catching a Pokemon when the pokeball collides with it
    this.body.onBeginContact.add(this.start_catching, this);
};

Pokemon.Pokeball.prototype.enable = function (enable) {
    "use strict";
    this.visible = enable;
    this.inputEnabled = enable && (this.game_state.game.number_of_pokeballs[this.type] > 0);
    this.checkWorldBounds = enable && (this.game_state.game.number_of_pokeballs[this.type] > 0);
    this.number_of_pokeballs_text.visible = enable;
};

Pokemon.Pokeball.prototype.drag = function () {
    "use strict";
    this.dragging = true;
};

Pokemon.Pokeball.prototype.throw = function () {
    "use strict";
    var distance_to_initial_position;
    
    // stop draggin the pokeball
    this.dragging = false;
    
    // throw the pokeball if the distance to the initial position is above the threshold
    distance_to_initial_position = new Phaser.Point(this.x - this.initial_position.x, this.y - this.initial_position.y);
    if (distance_to_initial_position.getMagnitude() > this.THROW_THRESHOLD) {
        this.game_state.game.number_of_pokeballs[this.type] -= 1;
        // update database
        firebase.database().ref("/users/" + firebase.auth().currentUser.uid + "/number_of_pokeballs").set(this.game_state.game.number_of_pokeballs);
        this.number_of_pokeballs_text.text = this.game_state.game.number_of_pokeballs[this.type];
        distance_to_initial_position.normalize();
        // initialize the pokeball physical body
        this.init_body();
        this.body.velocity.x = -distance_to_initial_position.x * this.pokeball_speed;
        this.body.velocity.y = -distance_to_initial_position.y * this.pokeball_speed;
    } else {
        this.reset(this.initial_position.x, this.initial_position.y);
    }
};

Pokemon.Pokeball.prototype.start_catching = function (body_b) {
    "use strict";
    var pokemon, pokemon_position, rotate_tween;
    this.body.destroy();
    
    pokemon = body_b.sprite;
    pokemon.visible = false;
    
    // play a rotate animation to simulate the catching process
    rotate_tween = this.game_state.game.add.tween(this);
    rotate_tween.to({angle: "-45"}, Phaser.Timer.SECOND * this.TWEEN_DURATION);
    rotate_tween.to({angle: "+90"}, Phaser.Timer.SECOND * this.TWEEN_DURATION * 2);
    rotate_tween.to({angle: "-45"}, Phaser.Timer.SECOND * this.TWEEN_DURATION);
    rotate_tween.onComplete.add(this.try_catching.bind(this, pokemon), this);
    rotate_tween.start();
};

Pokemon.Pokeball.prototype.try_catching = function (pokemon) {
    "use strict";
    var random_number;
    // check if the pokemon was caught
    random_number = this.game_state.rnd.frac();
    if (random_number < this.catching_rate) {
        pokemon.catch();
        this.kill();
    } else {
        // check if the pokemon has fled
        if (!pokemon.fled()) {
            pokemon.visible = true;
            this.reset(this.initial_position.x, this.initial_position.y);
        } else {
            this.kill();
        }
    }
};

Pokemon.Pokeball.prototype.back_to_center = function () {
    "use strict";
    this.body.destroy();
    this.reset(this.initial_position.x, this.initial_position.y);
};
