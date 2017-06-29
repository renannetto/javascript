var Pokemon = Pokemon || {};

Pokemon.PokemonSpawner = function (game_state, name, position, properties) {
    "use strict";
    Pokemon.Prefab.call(this, game_state, name, position, properties);
    
    this.DEFAULT_SPAWN_PROPERTIES = {
        texture: "",
        group: "spawns",
        duration: {min: 30, max: 60},
        detection_radius: 50,
        pokemon_properties: {
        
        }
    };
    
    this.spawn_time_min = +properties.spawn_time_min;
    this.spawn_time_max = +properties.spawn_time_max;
    this.spawn_range = +properties.spawn_range;
    
    this.spawn_timer = this.game_state.time.create(false);
    this.schedule_spawn();
};

Pokemon.PokemonSpawner.prototype = Object.create(Pokemon.Prefab.prototype);
Pokemon.PokemonSpawner.prototype.constructor = Pokemon.PokemonSpawner;

Pokemon.PokemonSpawner.prototype.schedule_spawn = function () {
    "use strict";
    var time;
    // add a new spawn event with random time between a range
    time = this.game_state.rnd.between(this.spawn_time_min, this.spawn_time_max);
    this.spawn_timer.add(Phaser.Timer.SECOND * time, this.select_pokemon, this);
    this.spawn_timer.start();
};

Pokemon.PokemonSpawner.prototype.select_pokemon = function () {
    "use strict";
    var random_number, pokemon_index, pokemon_data;
    random_number = this.game_state.rnd.frac();
    for (pokemon_index = 0; pokemon_index < this.game_state.pokemon_probabilities.length; pokemon_index += 1) {
        pokemon_data = this.game_state.pokemon_probabilities[pokemon_index];
        if (random_number < pokemon_data.probability) {
            this.spawn(pokemon_data);
            break;
        }
    }
};

Pokemon.PokemonSpawner.prototype.spawn = function (pokemon_data) {
    "use strict";
    var pool, spawn_name, distance, spawn_position, spawn_properties;
    pool = this.game_state.groups.spawns;
    spawn_name = this.name + "_spawn_" + pool.countLiving() + pool.countDead();
    distance = new Phaser.Point(this.game_state.rnd.between(-this.spawn_range, this.spawn_range), this.game_state.rnd.between(-this.spawn_range, this.spawn_range));
    spawn_position = new Phaser.Point(this.x + distance.x, this.y + distance.y);
    spawn_properties = Object.create(this.DEFAULT_SPAWN_PROPERTIES);
    spawn_properties.texture = pokemon_data.properties.texture;
    spawn_properties.pokemon_properties = pokemon_data.properties;
    Pokemon.create_prefab_from_pool(pool, Pokemon.PokemonSpawn.prototype.constructor, this.game_state, spawn_name, spawn_position, spawn_properties);
    
    this.schedule_spawn();
};