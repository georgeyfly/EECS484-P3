// Query 2
// Unwind friends and create a collection called 'flat_users' where each document has the following schema:
// {
//   user_id:xxx
//   friends:xxx
// }
// Return nothing.

function unwind_friends(dbname) {
  // You can use db.getSiblingDB() as an alternative to the use <database> helper.
  db = db.getSiblingDB(dbname);

  // TODO: unwind friends
  // $unwind Deconstructs an array field from the input documents to output a document for each element.
  // Each output document is the input document with the value of the array field replaced by the element.
  
  // $project takes a document that can specify the inclusion of fields, 
  // the suppression of the _id field, the addition of new fields, and the 
  // resetting of the values of existing fields. Alternatively, you may specify the exclusion of fields.
  
  // $out takes a string that specifies the output collection name.
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
      $out: "flat_users",
    },
  ]);
  return;
}
