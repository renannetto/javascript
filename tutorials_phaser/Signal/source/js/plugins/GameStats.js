var Phaser = Phaser || {};
var SignalExample = SignalExample || {};

SignalExample.GameStats = function (game, parent) {
    "use strict";
    Phaser.Plugin.call(this, game, parent);
};

SignalExample.GameStats.prototype = Object.create(Phaser.Plugin.prototype);
SignalExample.GameStats.prototype.constructor = SignalExample.GameStats;

SignalExample.GameStats.prototype.init = function (game_state, game_stats_data) {
    "use strict";
    // save properties
    this.game_state = game_state;
    this.game_stats_position = game_stats_data.position;
    this.game_stats_text_style = game_stats_data.text_style;
    this.game_stats = game_stats_data.game_stats;
    this.listeners = game_stats_data.listeners;
};

SignalExample.GameStats.prototype.listen_to_events = function () {
    "use strict";
    this.listeners.forEach(function (listener) {
        // iterate through the group that should be listened        
        this.game_state.groups[listener.group].forEach(function (sprite) {
            // add a listener for each sprite in the group
            sprite.events[listener.signal].add(this.save_stat, this, 0, listener.stat_name, listener.value);
        }, this);
    }, this);
};

SignalExample.GameStats.prototype.save_stat = function (sprite, stat_name, value) {
    "use strict";
    // increase the corresponding game stat
    this.game_stats[stat_name].value += value;
};

SignalExample.GameStats.prototype.show_stats = function () {
    "use strict";
    var position, game_stat, game_stat_text;
    position = new Phaser.Point(this.game_stats_position.x, this.game_stats_position.y);
    for (game_stat in this.game_stats) {
        if (this.game_stats.hasOwnProperty(game_stat)) {
            // create a Phaser text for each game stat showing the final value
            game_stat_text = new Phaser.Text(this.game_state.game, position.x, position.y,
                                             this.game_stats[game_stat].text + this.game_stats[game_stat].value,
                                            Object.create(this.game_stats_text_style));
            game_stat_text.anchor.setTo(0.5);
            this.game_state.groups.hud.add(game_stat_text);
            position.y += 50;
        }
    }
};