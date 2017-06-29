var Tactics = Tactics || {};

Tactics.BattleState = function () {
    "use strict";
    Tactics.TiledState.call(this);
};

Tactics.BattleState.prototype = Object.create(Tactics.TiledState.prototype);
Tactics.BattleState.prototype.constructor = Tactics.BattleState;

Tactics.BattleState.prototype.init = function (level_data, extra_parameters) {
    "use strict";
    Tactics.TiledState.prototype.init.call(this, level_data);
    
    this.battle_ref = firebase.child("battles").child(extra_parameters.battle_id);
    this.local_player = extra_parameters.local_player;
    this.remote_player = extra_parameters.remote_player;
};

Tactics.BattleState.prototype.preload = function () {
    "use strict";
    this.load.text("classes_data", "assets/classes_data.json");
};

Tactics.BattleState.prototype.create = function () {
    "use strict";
    var world_grid;
    Tactics.TiledState.prototype.create.call(this);
    
    this.tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
    
    this.groups.menu_items.forEach(function (menu_item) {
        this.prefabs.menu.add_item(menu_item);
    }, this);
    
    world_grid = this.create_world_grid();
    this.pathfinding = this.game.plugins.add(Tactics.Pathfinding, world_grid, [-1], this.tile_dimensions);
    this.bfs = this.game.plugins.add(Tactics.BreadthFirstSearch, this.map);
    
    this.classes_data = JSON.parse(this.game.cache.getText("classes_data"));
    
    this.battle_ref.once("value", this.create_units_queue.bind(this));
    
    this.battle_ref.onDisconnect().remove();
    
    this.game.stage.disableVisibilityChange = true;
};

Tactics.BattleState.prototype.create_world_grid = function () {
    "use strict";
    var obstacles_layer, row_index, column_index, world_grid;
    obstacles_layer = this.map.layers[1];
    world_grid = [];
    for (row_index = 0; row_index < this.map.height; row_index += 1) {
        world_grid.push([]);
        for (column_index = 0; column_index < this.map.width; column_index += 1) {
            world_grid[row_index].push(obstacles_layer.data[row_index][column_index].index);
        }
    }
    return world_grid;
};

Tactics.BattleState.prototype.create_units_queue = function (snaphsot) {
    "use strict";
    var battle_data;
    battle_data = snaphsot.val();
    this.units_queue = new PriorityQueue({comparator: function (unit_a, unit_b) {
        return unit_a.prefab.act_turn - unit_b.prefab.act_turn;
    }});
    this.queue_player_units(battle_data, "player1");
    this.queue_player_units(battle_data, "player2");
    
    this.battle_ref.child("command").on("value", this.receive_command.bind(this));
    
    this.next_turn();
};

Tactics.BattleState.prototype.queue_player_units = function (battle_data, player) {
    "use strict";
    var unit_key, unit_data, unit_prefab;
    for (unit_key in battle_data[player].units) {
        if (battle_data[player].units.hasOwnProperty(unit_key)) {
            unit_data = battle_data[player].units[unit_key];
            unit_prefab = this.create_prefab(unit_data.name, unit_data, unit_data.position);
            unit_prefab.load_stats(this.classes_data);
            this.units_queue.queue({player: player, prefab: unit_prefab});
        }
    }
};

Tactics.BattleState.prototype.receive_command = function (snapshot) {
    "use strict";
    var command;
    command = snapshot.val();
    if (command) {
        switch (command.type) {
        case "move":
            this.move_unit(command.target);
            break;
        case "attack":
            this.attack_unit(command.target, command.damage);
            break;
        case "wait":
            this.wait();
            break;
        }
    }
};

Tactics.BattleState.prototype.next_turn = function () {
    "use strict";
    if (this.groups.player1_units.countLiving() === 0 || this.groups.player2_units.countLiving() === 0) {
        this.game_over();
    } else {
        this.clear_previous_turn();
        this.current_unit = this.units_queue.dequeue();
        if (this.current_unit.prefab.alive) {
            this.current_unit.prefab.tint = (this.current_unit.prefab.name.search("player1") !== -1) ? 0x0000ff : 0xff0000;
            console.log(this.current_unit.player);
            if (this.current_unit.player === this.local_player) {
                this.prefabs.menu.show(true);
            }
            this.current_unit.prefab.calculate_act_turn(this.current_unit.prefab.act_turn);
            this.units_queue.queue(this.current_unit);
        } else {
            this.send_wait_command();
        }
    }
};

Tactics.BattleState.prototype.game_over = function () {
    "use strict";
    var winner, winner_message;
    winner = (this.groups.player1_units.countLiving() === 0) ? "player2" : "player1";
    winner_message = this.game.add.text(this.game.world.centerX, this.game.world.centerY, winner + " wins", {font: "24px Arial", fill: "#FFF"});
    winner_message.anchor.setTo(0.5);
    this.game.input.onDown.add(function () {
        this.game.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState");
    }, this);
};

Tactics.BattleState.prototype.clear_previous_turn = function () {
    "use strict";
    if (this.current_unit) {
        this.current_unit.prefab.tint = 0xffffff;
    }
    this.groups.move_regions.forEach(function (region) {
        region.kill();
    }, this);
    this.groups.attack_regions.forEach(function (region) {
        region.kill();
    }, this);
};

Tactics.BattleState.prototype.highlight_regions = function (source, radius, region_pool, region_constructor) {
    "use strict";
    var positions, region_name, highlighted_region;
    positions = this.bfs.find_reachable_area(source, radius);
    positions.forEach(function (position) {
        region_name = "region_" + this.groups[region_pool].countLiving();
        highlighted_region = Tactics.create_prefab_from_pool(this.groups[region_pool], region_constructor, this, region_name, position, {texture: "highlighted_region_image", group: region_pool});
    }, this);
};

Tactics.BattleState.prototype.move = function () {
    "use strict";
    this.highlight_regions(this.current_unit.prefab.position, this.current_unit.prefab.stats.walking_radius, "move_regions", Tactics.MoveRegion.prototype.constructor);
};

Tactics.BattleState.prototype.send_move_command = function (target_position) {
    "use strict";
    this.battle_ref.child("command").set({type: "move", target: {x: target_position.x, y: target_position.y}});
};

Tactics.BattleState.prototype.move_unit = function (target) {
    "use strict";
    this.current_unit.prefab.move_to(target);
    this.next_turn();
};

Tactics.BattleState.prototype.attack = function () {
    "use strict";
    this.highlight_regions(this.current_unit.prefab.position, this.current_unit.prefab.stats.attack_range, "attack_regions", Tactics.AttackRegion.prototype.constructor);
};

Tactics.BattleState.prototype.send_attack_command = function (target_unit) {
    "use strict";
    var damage;
    damage = this.current_unit.prefab.calculate_damage(target_unit);
    this.battle_ref.child("command").set({type: "attack", target: target_unit.name, damage: damage});
};

Tactics.BattleState.prototype.attack_unit = function (target_name, damage) {
    "use strict";
    this.prefabs[target_name].receive_damage(damage);
    this.next_turn();
};

Tactics.BattleState.prototype.send_wait_command = function () {
    "use strict";
    this.battle_ref.child("command").set({type: "wait", unit: this.current_unit.prefab.name});
};

Tactics.BattleState.prototype.wait = function () {
    "use strict";
    this.next_turn();
};