var db = require('mysql');
var http = require('http');
// var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var cookie = require('cookie');
var template = require('./template.js');
var path = require('path');

var database = db.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1111',
    database : 'seoki'
});

function signin(id,pwd,name){
    database.connect(function(err){
        if(err)throw err;
        console.log("connect\n");
        var sql = `INSERT INTO login_app(ID,PWD,NICKNAME,CREATED) VALUES("${id}","${pwd}","${name}",NOW())`;
        database.query(sql,function(err,result){
            if(err) throw err;
            console.log("success to recode\n");
        });
    });
}

var app = http.createServer(function(req,res){
    var _url = req.url;
    var pathname = url.parse(_url, true).pathname;
  
    if(pathname === '/'){
      var title = "Main";
      var body  = 
      `<form action = "/_process" method = "post">
      <h3>HELLO</h3>
      <p><input type = "text" placeholder = "Enter ID" name = "id"></p>
      <p><input type = "text" placeholder="Enter Password" name = "pwd"></p>
      <p><input type = "text" placeholder="Enter Nickname" name = "nickname"></p>
      <p><button type = "submit">Login</button></p>
      <a href = "/signin"> 회원가입</a>
      </form>`
        
      var html = template.HTML(title,body);
      res.writeHead(200);
      res.end(html);
    }
    else if(pathname === '/_process'){
        var post = qs.parse(body);
        console.log(post);
    }
});

app.listen(4000,function(){
    console.log("hello server;")
});