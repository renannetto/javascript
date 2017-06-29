var SignalExample = SignalExample || {};

SignalExample.LevelState = function () {
    "use strict";
    Phaser.State.call(this);
    
    this.prefab_classes = {
        "ship": SignalExample.Ship.prototype.constructor,
        "enemy_spawner": SignalExample.EnemySpawner.prototype.constructor
    };
};

SignalExample.LevelState.prototype = Object.create(Phaser.State.prototype);
SignalExample.LevelState.prototype.constructor = SignalExample.LevelState;

SignalExample.LevelState.prototype.init = function (level_data) {
    "use strict";
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 0;
};

SignalExample.LevelState.prototype.create = function () {
    "use strict";
    var group_name, prefab_name;
    
    this.space = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, "space_image");
    
    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);
    
    // create prefabs
    this.prefabs = {};
    for (prefab_name in this.level_data.prefabs) {
        if (this.level_data.prefabs.hasOwnProperty(prefab_name)) {
            // create prefab
            this.create_prefab(prefab_name, this.level_data.prefabs[prefab_name]);
        }
    }
    
    this.game_stats = this.game.plugins.add(SignalExample.GameStats, this, this.level_data.game_stats_data);
    this.game_stats.listen_to_events();
};

SignalExample.LevelState.prototype.create_prefab = function (prefab_name, prefab_data) {
    "use strict";
    var prefab;
    // create object according to its type
    if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
        prefab = new this.prefab_classes[prefab_data.type](this, prefab_name, prefab_data.position, prefab_data.properties);
    }
};

SignalExample.LevelState.prototype.game_over = function () {
    "use strict";
    //this.game.state.start("BootState", true, false, "assets/levels/level1.json", "LevelState");
    this.game_stats.show_stats();
};