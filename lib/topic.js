var connection = require("./db.js");
var template = require("./template.js");
var qs = require("querystring");
exports.home = function(request,response){
    connection.query(
        "SELECT * FROM topic",
        function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        var title = "welcome";
        var desc = "hello node.js";
        var list = template.list(results);
        var html = template.html(
            title,
            list,
            desc,
            `<ol><a href="/create">create</a></ol>`,
            ""
        );
        response.writeHead(200);
        response.end(html);
        }
    );
}
exports.page = function(queryData,request,response){
    connection.query(
        "SELECT * FROM topic",
        function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }
          connection.query(
            "SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?",
            [queryData.id],
            function (error2, result, fields) {
              if (error2) {
                throw error2;
              }
              var title = result[0].title;
              var desc = result[0].description;
              var list = template.list(results);
              var html = template.html(
                title,
                list,
                desc,
                ` 
               <ol><a href="/create">create</a> <a href="/update?id=${queryData.id}">update</a><form action="delete_process" method="post">
               <input type="hidden" name="id" value=${queryData.id}>
               <input type ="submit" value="delete">
               </form><ol>
               `,
                `by ${result[0].name}`
              );
              response.writeHead(200);
              response.end(html);
            }
          );
        }
      );
}
exports.create =function(request,response){
    connection.query("SELECT * FROM topic", function (error, results, fields) {
        if (error) {
          throw error;
        }
        connection.query("SELECT * FROM author", function (err, author) {
          if (err) {
            throw err;
          }
          var list = template.list(results);
          var title = "Web-Create";
          var html = template.html(
            title,
            list,
            `
            <form action="/create_process" method="post">
                <p><input type="<text>" placeholder="title" name="title"></p>
                <p>
                    <textarea name="desc"  placeholder="desc" id="" cols="30" rows="10"></textarea>
                </p>
                ${template.authorSelection(author)}
                <p>
                    <input type="submit" value="text">
                </p>
            </form>
            `,
            "",
            ""
          );
          response.writeHead(200);
          response.end(html);
        });
      });
}
exports.create_process=function(request,response){
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
        `INSERT INTO topic (title, description, created, author_id) 
        VALUES(?, ?, NOW(), ?)`,
        [post.title, post.desc, post.author],
        function (err, result) {
          if (err) {
            throw err;
          }
          response.writeHead(302, { Location: `/?id=${result.insertId}` });
          response.end();
        }
      );
    });
}
exports.update = function(queryData,request,response){
    connection.query("SELECT * FROM topic", function (error, topics, fields) {
        if (error) {
          throw error;
        }
        connection.query(
          "SELECT * FROM topic WHERE id=?",
          [queryData.id],
          function (error2, topic, fields) {
            if (error2) {
              throw error2;
            }
            connection.query("SELECT * FROM author", function (err, author) {
              if (err) {
                throw err;
              }
              var list = template.list(topics);
              var html = template.html(
                topic[0].title,
                list,
                `
                      <form action="/update_process" method="post">
                        <input type="hidden" name="id" value=${topic[0].id}>
                          <p><input type="<text>" value=${topic[0].title} name="title"></p>
                          <p>
                              <textarea name="desc" cols="30" rows="10" placeholder="desc">${topic[0].description}</textarea>
                          </p>
                          ${template.authorSelection(author,topic[0].author_id)}
                          <p>
                              <input type="submit" value="update">
                          </p>
                      </form>
                    `,
                `
                      <ol><a href="/create">create</a> <a href="/update/?id=${topic[0].id}">update</a><ol>
                    `
                    ,""
              );
              response.writeHead(200);
              response.end(html);
            });
          }
        );
      });
}
exports.update_process=function(request,response){
    var body = "";
    request.on("data", function (data) {
      body += data;
      if (body.length > 1e6) {
        request.connection.destroy();
        console.log("broke");
      }
    })
    request.on("end", function (data) {
      var post = qs.parse(body);
      var title = post.title;
      var id = post.id;
      var desc = post.desc;
      console.log(post);
      connection.query(
        `UPDATE topic SET title=? , description=?, author_id=? Where id=?`,
        [post.title, post.desc,post.author ,post.id],
        function (err, result) {
            response.writeHead(302, { Location: `/?id=${post.id}`});
            response.end();
        }
      )
    });
}
exports.delete_process = function(request,response){
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    })
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      connection.query(
        "DELETE FROM topic WHERE id=?",
        [post.id],
        function (err, result) {
          if (err) {
            throw err;
          }
          response.writeHead(302, { Location: "/" });
          response.end();
        }
      )
    });
}