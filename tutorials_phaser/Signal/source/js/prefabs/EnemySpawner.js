var SignalExample = SignalExample || {};

SignalExample.EnemySpawner = function (game_state, name, position, properties) {
    "use strict";
    SignalExample.Prefab.call(this, game_state, name, position, properties);
    
    this.enemy_properties = properties.enemy_properties;
    
    // start spawning event
    this.game_state.game.time.events.loop(Phaser.Timer.SECOND * properties.spawn_interval, this.spawn, this);
    
    // create spawn event to be listened
    this.events.onSpawn = new Phaser.Signal();
};

SignalExample.EnemySpawner.prototype = Object.create(Phaser.Sprite.prototype);
SignalExample.EnemySpawner.prototype.constructor = SignalExample.EnemySpawner;

SignalExample.EnemySpawner.prototype.spawn = function () {
    "use strict";
    var enemy, enemy_position, enemy_name, enemy_properties;
    // check if there is a dead enemy to reuse
    enemy = this.game_state.groups.enemies.getFirstDead();
    // spawn enemy in a random position inside the world
    enemy_position = new Phaser.Point(this.game_state.game.rnd.between(0.1 * this.game_state.game.world.width, 0.9 * this.game_state.game.world.width), this.y);
    if (enemy) {
        // if there is a dead enemy reset it to the current position
        enemy.reset(enemy_position.x, enemy_position.y);
    } else {
        // if there is no dead enemy, create a new one
        enemy_name = this.name + "_enemy" + this.game_state.groups.enemies.countLiving();
        enemy = new SignalExample.Enemy(this.game_state, enemy_name, enemy_position, this.enemy_properties);
    }
    
    // dispatch spawn event
    this.events.onSpawn.dispatch(this);
};