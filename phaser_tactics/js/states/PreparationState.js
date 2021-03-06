var Tactics = Tactics || {};

Tactics.PreparationState = function () {
    "use strict";
    Tactics.TiledState.call(this);
};

Tactics.PreparationState.prototype = Object.create(Tactics.TiledState.prototype);
Tactics.PreparationState.prototype.constructor = Tactics.PreparationState;

Tactics.PreparationState.prototype.init = function (level_data, extra_parameters) {
    "use strict";
    Tactics.TiledState.prototype.init.call(this, level_data);
    this.battle_ref = firebase.child("battles").child(extra_parameters.battle_id);
    this.local_player = extra_parameters.local_player;
    this.remote_player = extra_parameters.remote_player;
    
    this.units_to_place = [{type: "unit", name: this.local_player + "_knight_unit", properties: {texture: "knight_image", group: this.local_player + "_units", unit_class: "knight"}},
                          {type: "unit", name: this.local_player + "_archer_unit", properties: {texture: "archer_image", group: this.local_player + "_units", unit_class: "archer"}},
                          {type: "unit", name: this.local_player + "_mage_unit", properties: {texture: "mage_image", group: this.local_player + "_units", unit_class: "mage"}},
                          {type: "unit", name: this.local_player + "_princess_unit", properties: {texture: "princess_image", group: this.local_player + "_units", unit_class: "princess"}}];
};

Tactics.PreparationState.prototype.create = function () {
    "use strict";
    Tactics.TiledState.prototype.create.call(this);
    
    this.current_unit_to_place = this.units_to_place.shift();
    this.prefabs.current_unit_sprite.loadTexture(this.current_unit_to_place.properties.texture);
    
    this.battle_ref.onDisconnect().remove();
    this.game.stage.disableVisibilityChange = true;
};

Tactics.PreparationState.prototype.place_unit = function (position) {
    "use strict";
    this.current_unit_to_place.position = position;
    this.battle_ref.child(this.local_player).child("units").push(this.current_unit_to_place);
    this.create_prefab(this.current_unit_to_place.name, {type: "unit_sprite", properties: {texture: this.current_unit_to_place.properties.texture, group: "unit_sprites"}}, position);
    if (this.units_to_place.length > 0) {
        this.current_unit_to_place = this.units_to_place.shift();
        this.prefabs.current_unit_sprite.loadTexture(this.current_unit_to_place.properties.texture);
    } else {
        this.prefabs.current_unit_sprite.kill();
        this.groups.place_regions.forEach(function (region) {
            region.kill();
        }, this);
        this.battle_ref.child(this.local_player).child("prepared").set(true, this.wait_for_enemy.bind(this));
    }
};

Tactics.PreparationState.prototype.wait_for_enemy = function () {
    "use strict";
    this.battle_ref.child(this.remote_player).child("prepared").on("value", this.start_battle.bind(this));
};

Tactics.PreparationState.prototype.start_battle = function (snapshot) {
    "use strict";
    var prepared;
    prepared = snapshot.val();
    if (prepared) {
        this.game.state.start("BootState", true, false, "assets/levels/battle_level.json", "BattleState", {battle_id: this.battle_ref.key(), local_player: this.local_player, remote_player: this.remote_player});
    }
};