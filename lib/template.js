module.exports = {
  html: function templateHTML(title, list, desc, control, author) {
    return `
        <!doctype html>
            <html>
            <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
            <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
            <title>WEB3 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            
            <h1><a href="/">WEB</a></h1>
            <a href="/author">author</a>
                ${list}
            <div>
            ${control}
            </div>
            <h2>${title}</h2>
            <p>${desc}
            </p>
            <p>${author}
            </p>
            </body>
            </html>
        `;
  },
  list: function templatelist(filelist) {
    var list = "<ul>";
    var i = 0;
    while (i < filelist.length) {
      list =
        list +
        `<li><a href="/?id=${filelist[i].id}">${filelist[i].title}</a></li>`;
      i += 1;
    }
    list += "</ul>";
    return list;
  },
  authorSelection: function (authors,id) {
    var tag = "";
    var i = 0;
    while (i < authors.length) {
      var select="";
      if(authors[i].id===id){
        select = " selected";
      };
      tag += `<option value="${authors[i].id}"${select}>${authors[i].name}</option>`;
      i++;
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `;
  },
  author_list: function(authors){
    tag = 
   `<table class="table table-sm">
    <thead>
      <tr>
        <th scope="col">id</th>
        <th scope="col">author</th>
        <th scope="col">ProFile</th>
        <th scope="col">UPDATE</th>
        <th scope="col">DELETE</th>
      </tr>
    </thead>
    <tbody>
      `;
    var i = 0;
    while (authors.length>i){
      tag +=`<tr>`;
      tag+= `<th scope="row">${authors[i].id}</th>`;
      tag +=`<td>${authors[i].name}</td>`;
      tag +=`<td>${authors[i].profile}</td>`;

      tag += `<td><a href="/author/update?id=${authors[i].id}">UPDATE</a></td>`;
      tag += `<td><a href="/author/delete?id=${authors[i].id}">DELETE</a></td>`;
      tag += `</tr>`;
      i+=1;
    }
    tag += ` </tbody></table>`;
    return tag;
    ;
  }
};
  