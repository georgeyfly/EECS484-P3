// Query 8
// Find the city average friend count per user using MapReduce.

let city_average_friendcount_mapper = function () {
    // TODO: Implement the map function
    var value = {
        count: 1,
        friend_num: this.friends.length
    };
    emit(this.hometown.city, value);
};

let city_average_friendcount_reducer = function (key, values) {
    // TODO: Implement the reduce function
    let reduceVal = {count: 0, friend_num: 0};
    for (var i = 0; i < values.length; i++){
        reduceVal.count += values[i].count;
        reduceVal.friend_num += values[i].friend_num;
    }
    // values.forEach(function(value){
    //     reduceVal.count += value.count;
    //     reduceVal.friend_num += value.friend_num;
    // });
    return reduceVal;
};

let city_average_friendcount_finalizer = function (key, reduceVal) {
    // We've implemented a simple forwarding finalize function. This implementation
    // is naive: it just forwards the reduceVal to the output collection.
    // TODO: Feel free to change it if needed.
    reduceVal.avg = reduceVal.friend_num / reduceVal.count;
    return reduceVal;
};
