var Bomberboy = Bomberboy || {};

Bomberboy.Bomb = function (game_state, name, position, properties) {
    "use strict";
    Bomberboy.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);
    
    this.bomb_radius = +properties.bomb_radius;
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    
    this.exploding_animation = this.animations.add("exploding", [0, 2, 4], 1, false);
    this.exploding_animation.onComplete.add(this.explode, this);
    this.animations.play("exploding");
    
    this.owner = properties.owner;
};

Bomberboy.Bomb.prototype = Object.create(Bomberboy.Prefab.prototype);
Bomberboy.Bomb.prototype.constructor = Bomberboy.Bomb;

Bomberboy.Bomb.prototype.reset = function (position_x, position_y) {
    "use strict";
    Phaser.Sprite.prototype.reset.call(this, position_x, position_y);
    this.exploding_animation.restart();
};

Bomberboy.Bomb.prototype.explode = function () {
    "use strict";
    this.kill();
    var explosion_name, explosion_position, explosion_properties, explosion, wall_tile, block_tile;
    explosion_name = this.name + "_explosion_" + this.game_state.groups.explosions.countLiving();
    explosion_position = new Phaser.Point(this.position.x, this.position.y);
    explosion_properties = {texture: "explosion_image", group: "explosions", duration: 0.5};
    // create an explosion in the bomb position
    explosion = Bomberboy.create_prefab_from_pool(this.game_state.groups.explosions, Bomberboy.Explosion.prototype.constructor, this.game_state,
                                                      explosion_name, explosion_position, explosion_properties);
    
    // create explosions in each direction
    this.create_explosions(-1, -this.bomb_radius, -1, "x", explosion_properties);
    this.create_explosions(1, this.bomb_radius, +1, "x", explosion_properties);
    this.create_explosions(-1, -this.bomb_radius, -1, "y", explosion_properties);
    this.create_explosions(1, this.bomb_radius, +1, "y", explosion_properties);
    
    this.owner.current_bomb_index -= 1;
};

Bomberboy.Bomb.prototype.create_explosions = function (initial_index, final_index, step, axis, explosion_properties) {
    "use strict";
    var index, explosion_name, explosion_position, explosion, wall_tile, block_tile;
    for (index = initial_index; Math.abs(index) <= Math.abs(final_index); index += step) {
        explosion_name = this.name + "_explosion_" + this.game_state.groups.explosions.countLiving();
        // the position is different accoring to the axis
        if (axis === "x") {
            explosion_position = new Phaser.Point(this.position.x + (index * this.width), this.position.y);
        } else {
            explosion_position = new Phaser.Point(this.position.x, this.position.y + (index * this.height));
        }
        wall_tile = this.game_state.map.getTileWorldXY(explosion_position.x, explosion_position.y, this.game_state.map.tileWidth, this.game_state.map.tileHeight, "walls");
        block_tile = this.game_state.map.getTileWorldXY(explosion_position.x, explosion_position.y, this.game_state.map.tileWidth, this.game_state.map.tileHeight, "blocks");
        if (!wall_tile && !block_tile) {
            // create a new explosion in the new position
            explosion = Bomberboy.create_prefab_from_pool(this.game_state.groups.explosions, Bomberboy.Explosion.prototype.constructor, this.game_state, explosion_name, explosion_position, Object.create(explosion_properties));
        } else {
            if (block_tile) {
                this.game_state.map.removeTile(block_tile.x, block_tile.y, "blocks");
                this.game_state.pathfinding.remove_tile({row: block_tile.y, column: block_tile.x});
            }
            break;
        }
    }
};