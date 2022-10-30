var db = require('mysql');
var http = require('http');
// var fs = require('fs');
var url = require('url');
// var qs = require('querystring');
var cookie = require('cookie');
var template = require('./template.js');
var path = require('path');
var database = db.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1111',
    database : 'seoki'
});

database.connect();

var app = http.createServer(function(req,res){
    var _url = req.url;
    var pathname = url.parse(_url, true).pathname;
  
    if(pathname === '/'){
      var title = "Main";
      var body  = 
      `<form action = "login_process" method = "post">
      <h3>HELLO</h3>
      <p><input type = "text" placeholder = "Enter ID" name = "ID"></p>
      <p><input type = "password" placeholder="Enter Password" name = "pwd"></p>
      <p><button type = "submit">Login</button></p>
      <a href = "/signin"> 회원가입</a>
      </form>`
        
      var html = template.HTML(title,body);
      res.writeHead(200);
      res.end(html);
    }
});

app.listen(4000,function(){
    console.log("hello server;")
});




