var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "",
    user: "",
    password: "@@",
    database: "",
    port: 3000,
  });
connection.connect();
module.exports= connection;