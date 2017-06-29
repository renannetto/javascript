var Pokemon = Pokemon || {};

Pokemon.Pokedex = function (game_state, name, position, properties) {
    "use strict";
    Pokemon.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.DEFAULT_POKEMON_SPRITE_PROPERTIES = {
        texture: "",
        group: "pokemon_sprites",
        text_properties: {
            text: "",
            group: "hud",
            style: {
                font: "14px Arial",
                fill: "#000"
            }
        }
    };
    
    this.initial_pokemon_sprite_position = new Phaser.Point(this.x - (this.width / 2) + 50, this.y - (this.height / 2) + 50);
    
    // add input event to call game state method
    this.events.onInputDown.add(this.hide, this);
    
    this.visible = false;
};

Pokemon.Pokedex.prototype = Object.create(Pokemon.Prefab.prototype);
Pokemon.Pokedex.prototype.constructor = Pokemon.Pokedex;

Pokemon.Pokedex.prototype.show = function () {
    "use strict";
    var pokemon_sprite, pokemon_sprite_position;
    
    this.visible = true;
    this.inputEnabled = true;
    
    pokemon_sprite_position = new Phaser.Point(this.initial_pokemon_sprite_position.x, this.initial_pokemon_sprite_position.y);
    this.game_state.game.caught_pokemon.forEach(function (pokemon) {
        var pool, pokemon_sprite_name, pokemon_sprite_properties;
        pool = this.game_state.groups.pokemon_sprites;
        pokemon_sprite_name = "pokemon_sprite_name_" + pool.countLiving() + pool.countDead();
        pokemon_sprite_properties = Object.create(this.DEFAULT_POKEMON_SPRITE_PROPERTIES);
        pokemon_sprite_properties.texture = pokemon.texture;
        pokemon_sprite_properties.text_properties.text = pokemon.species;
        
        pokemon_sprite = Pokemon.create_prefab_from_pool(pool, Pokemon.PokemonSprite.prototype.constructor, this.game_state, pokemon_sprite_name, pokemon_sprite_position, pokemon_sprite_properties);
        pokemon_sprite_position.x += pokemon_sprite.width + 50;
        if (pokemon_sprite_position.x > (this.width - 50)) {
            pokemon_sprite_position.x = this.initial_pokemon_sprite_position.x;
            pokemon_sprite_position.y += pokemon_sprite.height + 50;
        }
    }, this);
};

Pokemon.Pokedex.prototype.hide = function () {
    "use strict";
    this.visible = false;
    this.inputEnabled = false;
    
    this.game_state.groups.pokemon_sprites.forEach(function (pokemon_sprite) {
        pokemon_sprite.kill();
    }, this);
};