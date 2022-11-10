const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const cookie = require('cookie');
const mysql = require('mysql');
const template = require('./template.js');
const bodyParser = require('body-parser');
const express = require('express');
const api = express();


api.use(express.json());
api.use(bodyParser.json());
api.use(express.urlencoded({extended:true}));

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


// function signin(id,pwd,name){
//     var sql = `INSERT INTO login_app(ID,PWD,NICKNAME,CREATED) VALUES('${id}','${pwd}','${name}',NOW())`;
//     db.query(sql,function(err,result){
//       console.log("successfuly to signin");
//       console.log(result);
//     });
// }
//회원가입 function 설정
function login(id,pwd){
  db.query("SELECT ID FROM login_app",)
}


function authIsOwner(req,res){
  var isOwner = false;
  var cookies = {};
  
  if(req.headers.cookie){
    cookies = cookie.parse(req.headers.cookie);
  }
  if(cookies.id == "seoki" && cookies.pwd == "1111"){
    isOwner = true;
  }
  console.log(isOwner);
  return isOwner;
}


var app = http.createServer(function(req,res){
  var _url = req.url;
  var qureyData = url.parse(_url,true).query;
  var pathname = url.parse(_url, true).pathname;

  
  if(pathname === '/'){
    if(qureyData.id === undefined){

    }
    var title = "Main";
    var body  = `
    <form action = "login_process" method = "post">
    <h3>HELLO</h3>
    <p><input type = "text" placeholder = "Enter ID" name = "ID"></p>
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
    var auth = false;
    var title;
    req.on('data',function(data){
      body += data;
    });
    req.on('end',function(){
      var post = qs.parse(body);
      console.log(post);
      console.log(post.undefinedID, post.pwd);
      
      auth = authIsOwner(req,res);
      if(auth){  //success to login
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
      <form action = "/signin_process" method = "post">
      <p><input type = "text" placeholder = "UserID" name = "id"></p>
      <p><input type = "text" placeholder = "UserPASSWORD" name = "pwd"></p>
      <p><input type = "text" placeholder = "Username" name = "nickname"></p>
      <button type = "submit">회원가입</button>
      </form>`;
      var html = template.HTML(title,body);

      res.end(html);
    }
    
    else if(pathname === "/signin_process"){
      var post = qs.parse(body);
      req.on('data',function(data){
        body += data;
      });
      req.on('end',function(){
        var post = qs.parse(body);
        console.log(post);
        signin(post.undefinedid,post.pwd,post.nickname);
      });
      res.writeHead(302,
        {Location : '/'});
      res.end();
  }
  else if(pathname === "/creat"){
    fs.readdir("./data",function(){
      var tilte = "글 생성";
      var body = `
      <form action = "/creat_process" method = "get">
      <p><input type = "text" name = "title" placeholder = "글 제목"></p>
      <p><textarea name = "des" placeholder = "글 내용"></textarea></p>
      <p><input type = "submit"></p>
      </form>
      `
      var html = template.HTML(tilte,body);
      res.writeHead(200);
      res.end(html);
    });
  }
  else if(pathname === '/creat_process'){
    var body = '';
    req.on('data',function(data){ //data를 수신할때마다 callback을 호출하라
      body += data;
    });
    req.on('end',function(){ 
      var post = qs.parse(body);
      var tilte = post.tilte;
      var desc = post.desc;

      console.log(tilte,desc);
    });
    
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
  `)
});
