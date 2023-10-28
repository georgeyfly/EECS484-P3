import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.TreeSet;
import java.util.Vector;

import org.json.JSONObject;
import org.json.JSONArray;

public class GetData {

    static String prefix = "project3.";

    // You must use the following variable as the JDBC connection
    Connection oracleConnection = null;

    // You must refer to the following variables for the corresponding 
    // tables in your database
    String userTableName = null;
    String friendsTableName = null;
    String cityTableName = null;
    String currentCityTableName = null;
    String hometownCityTableName = null;

    // DO NOT modify this constructor
    public GetData(String u, Connection c) {
        super();
        String dataType = u;
        oracleConnection = c;
        userTableName = prefix + dataType + "_USERS";
        friendsTableName = prefix + dataType + "_FRIENDS";
        cityTableName = prefix + dataType + "_CITIES";
        currentCityTableName = prefix + dataType + "_USER_CURRENT_CITIES";
        hometownCityTableName = prefix + dataType + "_USER_HOMETOWN_CITIES";
    }

    // TODO: Implement this function
    @SuppressWarnings("unchecked")
    public JSONArray toJSON() throws SQLException {

        // This is the data structure to store all users' information
        JSONArray users_info = new JSONArray();
        
        try (Statement stmt = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY)) {
            // Your implementation goes here....
            ResultSet rst = stmt.executeQuery(
                "Select u.user_id, u.first_name, u.last_name, u.gender, u.year_of_birth AS YOB, " +
                "       u.month_of_birth AS MOB, u.day_of_birth AS DOB," +
                "       c1.city_name AS current_city, c1.state_name AS current_state," +
                "       c1.country_name AS current_country," + 
                "       c2.city_name AS hometown_city, c2.state_name AS hometown_state," + 
                "       c2.country_name AS hometown_country" +
                " FROM " + userTableName + " u" +
                " JOIN " + currentCityTableName + " cu ON cu.user_id = u.user_id" +
                " JOIN " + cityTableName + " c1 ON c1.city_id = cu.current_city_id" +
                " JOIN " + hometownCityTableName + " ht ON ht.user_id = u.user_id " +
                " JOIN " + cityTableName + " c2 ON c2.city_id = ht.hometown_city_id"
            );


            while (rst.next()){
                // store one user info as map
                JSONObject user_info = new JSONObject();

                // add user basic info
                int user_id = rst.getInt(1);
                String first_name = rst.getString(2);
                String last_name = rst.getString(3);
                String gender = rst.getString(4);
                int YOB = rst.getInt(5);
                int MOB = rst.getInt(6);
                int DOB = rst.getInt(7);
                user_info.put("user_id", user_id);
                user_info.put("first_name", first_name);
                user_info.put("last_name", last_name);
                user_info.put("gender", gender);
                user_info.put("YOB", YOB);
                user_info.put("MOB", MOB);
                user_info.put("DOB", DOB);

                // add current city info
                JSONObject current_info = new JSONObject();
                String current_city = rst.getString(8);
                String current_state = rst.getString(9);
                String current_country = rst.getString(10);
                current_info.put("country", current_country);
                current_info.put("city", current_city);
                current_info.put("state", current_state);
                user_info.put("current", current_info);

                // add hometown city info
                JSONObject hometown_info = new JSONObject();
                String hometown_city = rst.getString(11);
                String hometown_state = rst.getString(12);
                String hometown_country = rst.getString(13);
                hometown_info.put("country", hometown_country);
                hometown_info.put("city", hometown_city);
                hometown_info.put("state", hometown_state);
                user_info.put("hometown", hometown_info);

                // find all friend id
                JSONArray friends_id = new JSONArray();
                try (Statement stmt1 = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY)) {
                    ResultSet rst1 = stmt1.executeQuery(
                        " Select user2_id" +
                        " FROM " + friendsTableName +
                        " WHERE user1_id = " + user_id
                    );
                    while (rst1.next()){
                        friends_id.put(rst1.getInt(1));
                    }
                    stmt1.close();
                    user_info.put("friends", friends_id);
                }

                users_info.put(user_info);
            }
            

            stmt.close();
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }

        return users_info;
    }

    // This outputs to a file "output.json"
    // DO NOT MODIFY this function
    public void writeJSON(JSONArray users_info) {
        try {
            FileWriter file = new FileWriter(System.getProperty("user.dir") + "/output.json");
            file.write(users_info.toString());
            file.flush();
            file.close();

        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
