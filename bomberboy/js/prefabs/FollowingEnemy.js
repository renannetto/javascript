var Bomberboy = Bomberboy || {};

Bomberboy.FollowingEnemy = function (game_state, name, position, properties) {
    "use strict";
    Bomberboy.Enemy.call(this, game_state, name, position, properties);
    
    this.detection_radius = +properties.detection_radius;
    
    this.following_player = false;
};

Bomberboy.FollowingEnemy.prototype = Object.create(Bomberboy.Enemy.prototype);
Bomberboy.FollowingEnemy.prototype.constructor = Bomberboy.FollowingEnemy;

Bomberboy.FollowingEnemy.prototype.update = function () {
    "use strict";
    var player_position, distance_to_player;
    Bomberboy.Enemy.prototype.update.call(this);
    player_position = this.game_state.prefabs.player.position;
    distance_to_player = this.position.distance(player_position);
    if (distance_to_player <= this.detection_radius && !this.following_player) {    
        this.stop();
        this.following_player = true;
        this.move_to_target(player_position);
    }
};

Bomberboy.FollowingEnemy.prototype.stop = function () {
    "use strict";
    Bomberboy.Enemy.prototype.stop.call(this);
    this.following_player = false;
};