var Pokemon = Pokemon || {};

Pokemon.TitleState = function () {
    "use strict";
    Pokemon.JSONLevelState.call(this);
    
    this.prefab_classes = {
        "text": Pokemon.TextPrefab.prototype.constructor,
        "login_button": Pokemon.LoginButton.prototype.constructor
    };
};

Pokemon.TitleState.prototype = Object.create(Pokemon.JSONLevelState.prototype);
Pokemon.TitleState.prototype.constructor = Pokemon.TitleState;

Pokemon.TitleState.prototype.create = function () {
    "use strict";
    var pokemon_data;
    Pokemon.JSONLevelState.prototype.create.call(this);
};

Pokemon.TitleState.prototype.on_login = function (result) {
    "use strict";
    firebase.database().ref("/users/" + result.user.uid).once("value").then(this.start_game.bind(this));
};

Pokemon.TitleState.prototype.start_game = function (snapshot) {
    "use strict";
    var user_data;
    user_data = snapshot.val();
    if (!user_data) {
        this.game.caught_pokemon = [];
        this.number_of_pokeballs = {pokeball: 0, greatball: 1, ultraball: 2};
    } else {
        this.game.caught_pokemon = user_data.caught_pokemon || [];
        this.game.number_of_pokeballs = user_data.number_of_pokeballs || {pokeball: 0, greatball: 1, ultraball: 2};
    }
    this.game.state.start("BootState", true, false, "assets/levels/world_level.json", "WorldState");
};