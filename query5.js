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
    let pipeline1 = [
        { $unwind: "$friends" },
        {
            $lookup: {
                from: "users",
                localField: "friends",
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
        }
    ];

    let aggCursor1 = db.users.aggregate(pipeline1);
    
    while(aggCursor1.hasNext()) {
        let doc = aggCursor1.next();
        results[doc._id] = doc.oldestFriend;
    }

    // Second, find the oldest friends considering users who list the current user_id in their "friends" array
    let allUserIds = db.users.find({}, {user_id: 1}).map(doc => doc.user_id);

    let pipeline2 = [
        { $match: { user_id: { $in: allUserIds } } },
        { $unwind: "$friends" },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "user_id",
                as: "userDetails"
            }
        },
        { $unwind: "$userDetails" },
        {
            $sort: {
                "userDetails.YOB": 1,
                "userDetails.user_id": 1
            }
        },
        {
            $group: {
                _id: "$friends",
                oldestFriend: { $first: "$userDetails.user_id" }
            }
        }
    ];
    

    let aggCursor2 = db.users.aggregate(pipeline2);

    while (aggCursor2.hasNext()) {
        let doc = aggCursor2.next();
        if (!results.hasOwnProperty(doc._id) || doc.oldestFriend < results[doc._id]) {
            results[doc._id] = doc.oldestFriend;
        }
    }

    return results;
}
