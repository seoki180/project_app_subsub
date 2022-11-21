const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const cookie = require('cookie');
const mysql = require('mysql');
const template = require('./template.js');

var db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '1111',
  database : 'seoki'
});  
// database 버전관리

db.connect(function(err){
  if(err) throw err;
  console.log("db connected\n");
})

function isAuth(username,password){
  db.query('SELECT * FROM login_app WHERE ID = ? AND PWD = ?', [username, password], function(error, results) {
      if (error) throw error;
      if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
        console.log("sucess")          
        return true;
      } 
      else {              
        console.log("fail")          
        return false;
      }            
  }); 
}
function insertionData(title,contents,author){
    var sql = `INSERT INTO post_app(TITLE,CONTENTS,AUTHOR,CREATED) VALUES('${title}','${contents}','${author}',NOW())`;
    db.query(sql,function(err,result){
      if(err) throw err;
      console.log("success");
      console.log(result);
    });
}
function insertionUserInfo(id,pwd,nickname){
  var sql = `INSERT INTO login_app(ID,PWD,NICKNAME,CREATED) VALUES('${id}','${pwd}','${nickname}',NOW())`;
    db.query(sql,function(err,result){
      if(err) throw err;
      console.log("success");
      console.log(result);
    });
}

var app = http.createServer(function(req,res){
  var _url = req.url;
  var qureyData = url.parse(_url,true).query;
  var pathname = url.parse(_url, true).pathname;

  if(pathname === '/'){
    var title = "Main";
    var body  = `
    <form action = "http://localhost:3000/login_process" method = "post">
    <h3>HELLO</h3>
    <p><input type = "text" placeholder = "Enter ID" name = "id"></p>
    <p><input type = "password" placeholder="Enter Password" name = "pwd"></p>
    <p><button type = "submit">Login</button></p>
    <p><a href = "/signin"> 회원가입</a></p>
    <a href = "/creat"> 글 쓰기</a>
    </form>`

    var html = template.HTML(title,body);
    res.writeHead(200);
    res.end(html);
  }
  
  else if(pathname === '/login_process'){ 
      var title;
      var body = '';
      req.on('data',function(data){
        body += data;
      });
      req.on('end',function(){
        var post = qs.parse(body);
        var Id = post.id;
        var Pwd = post.pwd;
        console.log(Id,Pwd);
        db.query('SELECT * FROM login_app WHERE ID = ? AND PWD = ?', [Id,Pwd], function(error, results) {
          if (error) throw error;
          if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
            title = "SUCCESS";
            body = 
            `<h3>Wellcome</h3>
            <form action = "/logout_process" method = "post">
            <button type = "submit">logout</button>
            </form>`;
            var html = template.HTML(title,body);
            res.writeHead(200);
            res.end(html);
          }
          else{
            res.end("fail");
          }
        });
      });
    }
      

  else if(pathname === "/logout_process"){
      console.log("try to log out");
      var body = '';
      req.on('data', function(data){
        body = body + data;
      });
      req.on('end', function(){
        res.writeHead(302,{
          "Set-Cookie" :[
            `id=;Max-Age =0`,
            `pwd=;Max-Age=0`
          ],
          Location:'/'
        });
        res.end();
      }); 
  }

    else if(pathname == "/signin"){
      var title = "SIGN IN Wellcome";
      var body = 
      `<h3>Wellcome</h3>
      <form action = "http://localhost:3000/signin_process" method ="post">
      <p><input type = "text" placeholder = "UserID" name = "id"></p>
      <p><input type = "password" placeholder = "UserPASSWORD" name = "pwd"></p>
      <p><input type = "text" placeholder = "Username" name = "nickname"></p>
      <button type = "submit">회원가입</button>
      </form>`;
      var html = template.HTML(title,body);
      res.end(html);
    }
    
    else if(pathname === "/signin_process"){
      var body = '';
      req.on('data', function(data){
        body = body + data;
      });
      req.on('end',function(){
        var post = qs.parse(body);
        var ID = post.id;
        var PWD = post.pwd;
        var NICKNAME = post.nickname;

        console.log(ID,PWD,NICKNAME);
        insertionUserInfo(ID,PWD,NICKNAME);
      });
      res.writeHead(302,
        {Location : '/'});
      res.end();
  }
  else if(pathname === "/creat"){
      var tilte = "글 생성";
      var body = `
      <form action = "http://localhost:3000/creat_process" method = "post">
      <p><input type = "text" name = "title" placeholder = "글 제목"></p>
      <p><input type = "text" name = "author" placeholder = "작성자"></p>
      <p><textarea name = "contents" placeholder = "글 내용"></textarea></p>
      <p><input type = "submit"></p>
      </form>
      `
      var html = template.HTML(tilte,body);
      res.writeHead(200);
      res.end(html);
  }
  else if(pathname === '/creat_process'){
    var body = '';
    req.on('data', function(data){ //data를 수신할때마다 callback을 호출하라
      body = body + data;
    });
    req.on('end',function(){ 
      var post = qs.parse(body);
      var title = post.title;
      var contents = post.contents;
      var author = post.author;
      console.log(title,contents);
      insertionData(title,contents,author);
    });
    res.writeHead(200);
    res.end("success");  
  }

  else {
    res.writeHead(404);
    res.end('Not found');
  }
});




app.listen(3000,function(){

  console.log(` 
  =======================
  success to open server!
  =======================
  `);
});
