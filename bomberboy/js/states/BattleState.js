var Bomberboy = Bomberboy || {};

Bomberboy.BattleState = function () {
    "use strict";
    Bomberboy.TiledState.call(this);
};

Bomberboy.BattleState.prototype = Object.create(Bomberboy.TiledState.prototype);
Bomberboy.BattleState.prototype.constructor = Bomberboy.BattleState;

Bomberboy.BattleState.prototype.init = function (level_data, extra_parameters) {
    "use strict";
    Bomberboy.TiledState.prototype.init.call(this, level_data);
    this.battle_ref = firebase.child("battles").child(extra_parameters.battle_id);
    this.local_player = extra_parameters.local_player;
    this.remote_player = extra_parameters.remote_player;
};

Bomberboy.BattleState.prototype.create = function () {
    "use strict";
    Bomberboy.TiledState.prototype.create.call(this);
    
    this.battle_ref.child(this.local_player).child("position").set(this.prefabs[this.local_player].position);
    
    this.battle_ref.child(this.remote_player).child("movement").on("value", this.update_player_movement.bind(this));
    this.battle_ref.child(this.remote_player).child("position").on("value", this.update_player_position.bind(this));
    
    this.battle_ref.child(this.remote_player).child("bombs").on("child_added", this.add_bomb.bind(this));
    
    this.battle_ref.onDisconnect().remove();
    
    this.game.stage.disableVisibilityChange = true;
};

Bomberboy.BattleState.prototype.update_player_movement = function (snapshot) {
    "use strict";
    this.prefabs[this.remote_player].movement = snapshot.val();
};

Bomberboy.BattleState.prototype.update_player_position = function (snapshot) {
    "use strict";
    var position;
    position = snapshot.val();
    this.prefabs[this.remote_player].position.x = position.x;
    this.prefabs[this.remote_player].position.y = position.y;
};

Bomberboy.BattleState.prototype.add_bomb = function (snapshot) {
    "use strict";
    this.prefabs[this.remote_player].drop_bomb(snapshot.val());
};

Bomberboy.BattleState.prototype.change_movement = function (direction_x, direction_y, move) {
    "use strict";
    this.prefabs[this.local_player].change_movement(direction_x, direction_y, move);
    this.battle_ref.child(this.local_player).child("movement").set(this.prefabs[this.local_player].movement);
    if (!move) {
        this.battle_ref.child(this.local_player).child("position").set({x: this.prefabs[this.local_player].position.x, y: this.prefabs[this.local_player].position.y});
    }
};

Bomberboy.BattleState.prototype.try_dropping_bomb = function () {
    "use strict";
    this.prefabs[this.local_player].try_dropping_bomb();
    this.battle_ref.child(this.local_player).child("bombs").push({x: this.prefabs[this.local_player].x, y: this.prefabs[this.local_player].y});
};

Bomberboy.BattleState.prototype.game_over = function () {
    "use strict";
    this.battle_ref.child(this.remote_player).child("movement").off();
    this.battle_ref.child(this.remote_player).child("position").off();
    this.battle_ref.child(this.remote_player).child("bombs").off();
    this.battle_ref.remove();
    this.game.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState");
};
