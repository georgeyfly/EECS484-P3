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

    return;
}
