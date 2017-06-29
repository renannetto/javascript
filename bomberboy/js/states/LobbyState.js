var Bomberboy = Bomberboy || {};

Bomberboy.LobbyState = function () {
    "use strict";
    Bomberboy.JSONLevelState.call(this);
    
    this.prefab_classes = {
        "text": Bomberboy.TextPrefab.prototype.constructor        
    };
    
    this.INITIAL_PLAYER_DATA = {movement: {left: false, right: false, up: false, down: false}, position: {x: 0, y: 0}};
};

Bomberboy.LobbyState.prototype = Object.create(Bomberboy.JSONLevelState.prototype);
Bomberboy.LobbyState.prototype.constructor = Bomberboy.LobbyState;

Bomberboy.LobbyState.prototype.create = function () {
    "use strict";
    Bomberboy.JSONLevelState.prototype.create.call(this);
    
    firebase.child("battles").once("value", this.find_battle.bind(this));
};

Bomberboy.LobbyState.prototype.find_battle = function (snapshot) {
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

Bomberboy.LobbyState.prototype.host_battle = function (snapshot) {
    "use strict";
    var battle_data;
    battle_data = snapshot.val();
    if (battle_data.full) {
        this.new_battle.off();
        this.game.state.start("BootState", true, false, "assets/levels/battle_level.json", "BattleState", {battle_id: snapshot.key(), local_player: "player1", remote_player: "player2"});
    }
};

Bomberboy.LobbyState.prototype.join_battle = function (battle_id) {
    "use strict";
    this.game.state.start("BootState", true, false, "assets/levels/battle_level.json", "BattleState", {battle_id: battle_id, local_player: "player2", remote_player: "player1"});
};