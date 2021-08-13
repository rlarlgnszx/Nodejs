const { query } = require("./db.js");
var connection = require("./db.js");
var template = require("./template.js");
var qs = require("querystring");
exports.home = function (request, response) {
  connection.query("SELECT * FROM author", function (error, results, fields) {
    if (error) {
      throw error;
    }
    connection.query("SELECT * FROM topic", function (err, topic) {
      var title = "AUTHOR";
      var desc = `
      <form action="/author_create" method="post">
          <p><input type="<text>" placeholder="author name" name="name"></p>
          <p>
              <textarea name="profile"  placeholder="profile" id="" cols="30" rows="10"></textarea>
          </p>
          <p>
              <input type="submit" value="submit">
          </p>
      </form>
      `;
      var list = template.list(topic);
      var author = template.author_list(results);
      var html = template.html(title, list, desc, author, "");
      response.writeHead(200);
      response.end(html);
    });
  });
};
exports.update = function (queryData, request, response) {
  connection.query("SELECT * FROM topic", function (error, topics, fields) {
    if (error) {
      throw error;
    }
    connection.query(
      "SELECT * FROM author",
      function (error, author_desc, fields) {
        if (error) {
          throw error;
        }
        connection.query(
          "SELECT * FROM author WHERE id=?",
          [queryData.id],
          function (error2, author, fields) {
            if (error2) {
              throw error2;
            }
            console.log(author);
            var list = template.list(topics);
            var html = template.html(
              "AUTHOR",
              list,
              `
                      <form action="/update_author" method="post">
                        <input type="hidden" name="id" value=${author[0].id}>
                          <p><input type="<text>" value=${author[0].name} name="name"></p>
                          <p>
                              <textarea name="profile" cols="30" rows="10" placeholder="profile">${author[0].profile}</textarea>
                          </p>
                          <p>
                              <input type="submit" value="update">
                          </p>
                      </form>
                    `,
              template.author_list(author_desc),
              ""
            );

            response.writeHead(200);
            response.end(html);
          }
        );
      }
    );
  });
};
exports.create_author = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body += data;
    if (body.length > 1e6) {
      request.connection.destroy();
    }
  });
  request.on("end", function (data) {
    var post = qs.parse(body);
    connection.query(
      `INSERT INTO author (name,profile) 
        VALUES(?, ?)`,
      [post.name, post.profile],
      function (err, result) {
        if (err) {
          throw err;
        }
        response.writeHead(302, { Location: "/author" });
        response.end();
      }
    );
  });
};
exports.update_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body += data;
    if (body.length > 1e6) {
      request.connection.destroy();
      console.log("broke");
    }
  });
  request.on("end", function (data) {
    var post = qs.parse(body);
    connection.query(
      `UPDATE author SET name=? , profile=?  Where id=?`,
      [post.name, post.profile, parseInt(post.id)],
      function (err, result) {
        throw err;
      }
    );
    response.writeHead(302, { Location: `/author` });
    response.end();
  });
}
exports.delete_process = function(queryData,request,response){
      connection.query(
        "DELETE FROM author WHERE id=?",
        [queryData.id],
        function (err, result) {
          if (err) {
            throw err;
          }
          response.writeHead(302, { Location: "/author" });
          response.end();
        }
      )
};
