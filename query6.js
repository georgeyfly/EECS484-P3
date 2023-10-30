// Query 6
// Find the average friend count per user.
// Return a decimal value as the average user friend count of all users in the users collection.

// function find_average_friendcount(dbname) {
//     db = db.getSiblingDB(dbname);

//     // TODO: calculate the average friend count
//     let total = 0;
//     let num = 0;
//     const friends_info = db.users.aggregate([
//         {
//             $project: {
//                 friends: 1
//             }
//         }
//     ]);
//     friends_info.forEach(function (user) {
//         total += length(user);
//         num += 1;
//     });

//     return total / num;
// }

function find_average_friendcount(dbname) {
    db = db.getSiblingDB(dbname);

    // TODO: calculate the average friend count
    let total = 0;
    let num = 0;
    const result = db.users.aggregate([
        {
            $project: {
                friendCount: { $size: "$friends" },
            }
        },
        {
            $group: {
                _id: null,
                avg_count: { $avg: "$friendCount" }
            }
        }
    ]).toArray();

    return result.length() > 0 ? result[0].avg_count: 0;
}

