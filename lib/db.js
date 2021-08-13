var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "61296129kh@@",
    database: "opentutorials",
    port: 3000,
  });
connection.connect();
module.exports= connection;