// Query 5
// Find the oldest friend for each user who has a friend. For simplicity,
// use only year of birth to determine age, if there is a tie, use the
// one with smallest user_id. You may find query 2 and query 3 helpful.
// You can create selections if you want. Do not modify users collection.
// Return a javascript object : key is the user_id and the value is the oldest_friend id.
// You should return something like this (order does not matter):
// {user1:userx1, user2:userx2, user3:userx3,...}

function oldest_friend(dbname) {
    db = db.getSiblingDB(dbname);

    let results = {};
    // TODO: implement oldest friends
    db.users.aggregate([
        {
          $unwind: "$friends",
        },
        {
          $project: {
            _id: 0,
            user_id: 1,
            friends: 1,
          },
        },
        {
            $group: {_id: "$friends", lessfriends: {$push: "$user_id"}}
        },
        {
          $out: "less_friends",
        }
      ]);


      db.users.aggregate([
        {
            $lookup: {
                from: "less_friends",
                localField: "user_id",
                foreignField: "_id",
                as: "combinedFriends"
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$combinedFriends", 0 ] }, "$$ROOT" ] } }
         },
         { $project: { combinedFriends: 0 } },
        { $project: { _id: 0, user_id: 1, allfriends: {$setUnion: [{$ifNull: ["$friends", []]}, {$ifNull: ["$lessfriends", []]} ] } } },
        { $sort: { user_id : 1}},
        { $out: "merged_friends",}
         ]);
        
        db.merged_friends.aggregate([
            { $unwind: "$allfriends" },
        {
            $lookup: {
                from: "users",
                localField: "allfriends",
                foreignField: "user_id",
                as: "friendDetails"
            }
        },
        { $unwind: "$friendDetails" },
        {
            $sort: {
                "friendDetails.YOB": 1,
                "friendDetails.user_id": 1
            }
        },
        {
            $group: {
                _id: "$user_id",
                oldestFriend: { $first: "$friendDetails.user_id" }
            }
        },
        { $out: "oldestFriend",}
        ]);

        db.oldestFriend.find().forEach(function(doc) {
            results[doc._id] = doc.oldestFriend;
        });
      
    return results;
}
