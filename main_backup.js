var http = require("http");
var fs = require("fs");
var url = require("url");
const path = require("path/posix");
var template = require("./lib/template.js");
var sanitizeHtml = require("sanitize-html");
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var qs = require("querystring");

  //console.log(queryData.id);
  // console.log(url.parse(_url, true));

  if (pathname == "/") {
    if (queryData.id === undefined) {
      var title = "welcome";
      var desc = "hello node.js";
      fs.readdir("data", function (er, filelist) {
        var list = template.list(filelist);
        var html = template.html(
          title,
          list,
          desc,
          `<ol><a href="/create">create</a></ol>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readFile(`data/${queryData.id}`, "utf8", function (err, data) {
        fs.readdir("data", function (er, filelist) {
          var filterdID = path.parse(queryData.id).base;
          var list = template.list(filelist);
          var sanitizedTitle = sanitizeHtml(queryData.id);
          var sanitizedDesc = sanitizeHtml(data, { allowedTags: ["h1"] });
          var html = template.html(
            sanitizedTitle,
            list,
            sanitizedDesc,
            `
          <ol><a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a><form action="delete_process" method="post">
          <input type="hidden" name="id" value=${sanitizedTitle}>
          <input type ="submit" value="delete">
          </form><ol>
          `
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === "/create") {
    var title = "Web-Create";
    var desc = "hello node.js";
    fs.readdir("data", function (er, filelist) {
      var list = template.list(filelist);
      var html = template.html(
        title,
        list,
        `
        <form action="/create_process" method="post">
            <p><input type="<text>" placeholder="title" name="title"></p>
            <p>
                <textarea name="desc"  placeholder="desc" id="" cols="30" rows="10"></textarea>
            </p>
            <p>
                <input type="submit" value="text">
            </p>
        </form>
        `,
        ""
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    });
    request.on("end", function (data) {
      var post = qs.parse(body);
      var title = post.title;
      var desc = post.desc;
      fs.writeFile(`data/${title}`, desc, "utf-8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("data", function (er, filelist) {
      fs.readFile(`data/${queryData.id}`, "utf8", function (err, desc) {
        var list = template.list(filelist);
        // console.log(desc);
        var html = template.html(
          queryData.id,
          list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value=${queryData.id}>
              <p><input type="<text>" value=${queryData.id} name="title"></p>
              <p>
                  <textarea name="desc" cols="30" rows="10" placeholder="desc">${desc}</textarea>
              </p>
              <p>
                  <input type="submit" value="update">
              </p>
          </form>
        `,
          `
          <ol><a href="/create">create</a> <a href="/update/?id=${queryData.id}">update</a><ol>
        `
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      body += data;
      if (body.length > 1e6) {
        request.connection.destroy();
      }
    });
    request.on("end", function (data) {
      var post = qs.parse(body);
      console.log(post);
      var title = post.title;
      var id = post.id;
      var desc = post.desc;
      console.log(post);
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, desc, "utf-8", function (error) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      console.log(post);
      fs.unlink(`data/${id}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(8000);
