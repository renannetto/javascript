var Pokemon = Pokemon || {};

Pokemon.CatchState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.prefab_classes = {
        "background": Pokemon.Prefab.prototype.constructor,
        "pokeball": Pokemon.Pokeball.prototype.constructor,
        "pokemon": Pokemon.Pokemon.prototype.constructor
    };
};

Pokemon.CatchState.prototype = Object.create(Phaser.State.prototype);
Pokemon.CatchState.prototype.constructor = Pokemon.CatchState;

Pokemon.CatchState.prototype.init = function (level_data) {
    "use strict";
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    // start physics system
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.arcade.gravity.y = 0;
};

Pokemon.CatchState.prototype.create = function () {
    "use strict";
    var group_name, prefab_name;
    
    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);
    
    this.collision_groups = {};
    this.level_data.collision_groups.forEach(function (collision_group_name) {
        this.collision_groups[collision_group_name] = this.game.physics.p2.createCollisionGroup();
    }, this);
    
    // create prefabs
    this.prefabs = {};
    for (prefab_name in this.level_data.prefabs) {
        if (this.level_data.prefabs.hasOwnProperty(prefab_name)) {
            // create prefab
            this.create_prefab(prefab_name, this.level_data.prefabs[prefab_name]);
        }
    }
};

Pokemon.CatchState.prototype.create_prefab = function (prefab_name, prefab_data) {
    "use strict";
    var prefab_position, prefab;
    // create object according to its type
    if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
        if (prefab_data.position.x > 0 && prefab_data.position.x <= 1) {
            // position as percentage
            prefab_position = new Phaser.Point(prefab_data.position.x * this.game.world.width,
                                              prefab_data.position.y * this.game.world.height);
        } else {
            // position as absolute number
            prefab_position = prefab_data.position;
        }
        prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, prefab_position, prefab_data.properties);
    }
    return prefab;
};

Pokemon.CatchState.prototype.return_to_world = function () {
    "use strict";
    this.game.state.start("BootState", true, false, "assets/levels/world_level.json", "WorldState");
};
