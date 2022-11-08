var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var cookie = require('cookie');
var template = require('./template.js');
var path = require('path');
var mysql = require('mysql');

var db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '1111',
  database : 'seoki'
});  
// database 버전관리

db.connect(function(err){
  if(err){
    console.log("error occur!!\n");
    throw err;
  }
});


function signin(req,res){
    console.log(req.input_id);
    var sql = `INSERT INTO login (ID,PWD,NICKNAME,CREATED) VALUES('${req.id}','${req.pwd}','${req.name}',NOW())`;
    db.query(sql,function(err,result){
      if(err) throw err;
      console.log("successfuly to signin");
      console.log(result);
    });
}
//회원가입 function 설정


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
  var pathname = url.parse(_url, true).pathname;
  
  if(pathname === '/'){
    var title = "Main";
    var body  = `
    <form action = "login_process" method = "post">
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
      
      // if(post.undefinedID =="seoki" && post.pwd == "1111"){
      //   res.writeHead(302,{
      //     "Set-Cookie" :[
      //       `id = ${post.undefinedID}`,
      //       `pwd = ${post.pwd}`]
      //     });
      //     auth = authIsOwner(req,res);
      //   }

      auth = authIsOwner(req,res);
      if(auth){  //success to login
        title = "SUCCESS";
        body = `<h3>Wellcome</h3>
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
      <p><input type = "text" placeholder = "UserID" name = "input_id"></p>
      <p><input type = "text" placeholder = "UserPASSWORD" name = "input_pwd"></p>
      <p><input type = "text" placeholder = "Username" name = "input_nickname"></p>
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
      });

      res.writeHead(302,{Location : '/'});
      res.end();
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
