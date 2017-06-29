var Pokemon = Pokemon || {};

Pokemon.create_prefab_from_pool = function (pool, prefab_constructor, game_state, prefab_name, prefab_position, prefab_properties) {
    "use strict";
    var prefab;
    // get the first dead prefab from the pool
    prefab = pool.getFirstDead();
    if (!prefab) {
        // if there is no dead prefab, create a new one
        prefab = new prefab_constructor(game_state, prefab_name, prefab_position, prefab_properties);
    } else {
        // if there is a dead prefab, reset it in the new position
        prefab.reset(prefab_position.x, prefab_position.y);
    }
    return prefab;
};

Pokemon.choose_randomly = function (rnd, probabilities) {
    "use strict";
    var random_number, element_index, element;
    random_number = rnd.frac();
    for (element_index = 0; element_index < probabilities.length; element_index += 1) {
        element = probabilities[element_index];
        if (random_number < element.probability) {
            return element;
        }
    }
};