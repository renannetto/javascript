var Tactics = Tactics || {};

Tactics.LobbyState = function () {
    "use strict";
    Tactics.JSONLevelState.call(this);
    
    this.prefab_classes = {
        "text": Tactics.TextPrefab.prototype.constructor
    };
    
    this.INITIAL_PLAYER_DATA = {prepared: false, units: {}};
};

Tactics.LobbyState.prototype = Object.create(Tactics.JSONLevelState.prototype);
Tactics.LobbyState.prototype.constructor = Tactics.LobbyState;

Tactics.LobbyState.prototype.create = function () {
    "use strict";
    Tactics.JSONLevelState.prototype.create.call(this);
    
    firebase.child("battles").once("value", this.find_battle.bind(this));
};

Tactics.LobbyState.prototype.find_battle = function (snapshot) {
    "use strict";
    var battles, battle, chosen_battle, new_battle;
    battles = snapshot.val();
    for (battle in battles) {
        if (battles.hasOwnProperty(battle) && !battles[battle].full) {
            chosen_battle = battle;
            firebase.child("battles").child(chosen_battle).child("full").set(true, this.join_battle.bind(this, chosen_battle));
            break;
        }
    }
    if (!chosen_battle) {
        this.new_battle = firebase.child("battles").push({player1: this.INITIAL_PLAYER_DATA, player2: this.INITIAL_PLAYER_DATA, full: false});
        this.new_battle.on("value", this.host_battle.bind(this));
    }
};

Tactics.LobbyState.prototype.host_battle = function (snapshot) {
    "use strict";
    var battle_data;
    battle_data = snapshot.val();
    if (battle_data.full) {
        this.new_battle.off();
        this.game.state.start("BootState", true, false, "assets/levels/preparation_level.json", "PreparationState", {battle_id: snapshot.key(), local_player: "player1", remote_player: "player2"});
    }
};

Tactics.LobbyState.prototype.join_battle = function (battle_id) {
    "use strict";
    this.game.state.start("BootState", true, false, "assets/levels/preparation_level.json", "PreparationState", {battle_id: battle_id, local_player: "player2", remote_player: "player1"});
};