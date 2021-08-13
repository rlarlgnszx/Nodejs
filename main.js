var http = require("http");
var fs = require("fs");
const path = require("path/posix");
var template = require("./lib/template.js");
var connection = require("./lib/db.js");
var topic = require("./lib/topic.js");
var author = require("./lib/author.js");

const { report } = require("process");
var url = require("url");
const { authorSelection } = require("./lib/template.js");
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname == "/") {
    if (queryData.id === undefined) {
      topic.home(request, response);
    } else {
      topic.page(queryData, request, response);
    }
  } else if (pathname === "/create") {
    topic.create(request, response);
  } else if (pathname === "/create_process") {
    topic.create_process(request, response);
  } else if (pathname === "/update") {
    topic.update(queryData, request, response);
  } else if (pathname === "/update_process") {
    topic.update_process(request, response);
  } else if (pathname === "/delete_process") {
    topic.delete_process(request, response);
  } else if (pathname === "/author") {
    author.home(request, response);
  } else if (pathname === "/author_create") {
    author.create_author(request, response);
  }else if (pathname === "/author/update") {
    author.update(queryData,request, response);
  }else if (pathname === "/update_author") {
    author.update_process(request, response);
  }else if (pathname === "/author/delete") {
    author.delete_process(queryData,request, response);
  }else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(8000);
