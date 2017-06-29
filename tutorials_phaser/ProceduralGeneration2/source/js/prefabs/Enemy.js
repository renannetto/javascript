var ProceduralGeneration = ProceduralGeneration || {};

ProceduralGeneration.Enemy = function (game_state, name, position, properties) {
    "use strict";
    ProceduralGeneration.Prefab.call(this, game_state, name, position, properties);
    
    this.anchor.setTo(0.5);

    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
};

ProceduralGeneration.Enemy.prototype = Object.create(ProceduralGeneration.Prefab.prototype);
ProceduralGeneration.Enemy.prototype.constructor = ProceduralGeneration.Enemy;

ProceduralGeneration.Enemy.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.heroes, this.kill, null, this);
};