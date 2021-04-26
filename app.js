const express = require("express");
const ejs = require("ejs");
const mySql = require("mysql");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

//let posts = [];

var con = mySql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "blog"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Dataase!");
  var sql = "CREATE TABLE IF NOT EXISTS blogs (id int NOT NULL AUTO_INCREMENT, title varchar(500), content text, PRIMARY KEY (id))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created..");
  });
});

app.get("/", function(req, res){
  con.query("select * from blogs",(err,posts)=>{
    //console.log(posts);
    if (err) throw err;
    res.render("home", {
      posts: posts
    });
  });
});

app.get("/compose", function(req, res){
    res.render("compose");
  });
  
  app.post("/compose", function(req, res){
      let title= req.body.postTitle;
      let content= req.body.postBody;
    con.query(`INSERT INTO blogs(title,content) VALUES ("${title}","${content}");`, (err, result)=>{
      if (err)
      throw err;
      res.redirect("/");
    });
  });

  app.post("/update/:id", (req,res)=>{
    let id = req.params.id;
    let title= req.body.postTitle;
    let content= req.body.postBody;
    con.query(`UPDATE blogs set title = "${title}", content="${content}" where id = ${id}`, (err, result)=>{
      if (err)
      throw err;
      res.redirect("/");
    });
  });
  
  app.get("/posts/:id", function(req, res){
    let id = req.params.id;
    con.query("select * from blogs where id=?",[id],(err,post)=>{
      if (err) throw err;
      res.render("post", {
        post:post[0]
      });
    });
  });

  app.get("/edit/:id",(req,res)=>{
    const id=req.params.id;
    con.query("select * from blogs where id=?",[id],(err,post)=>{
      if(err)
      throw err;
      res.render("edit", {
        post:post[0]
      });
    });
  });

  app.get("/delete/:id",(req,res)=>{
    let id=req.params.id;
    con.query("delete from blogs where id=?",[id],(err,result)=>{
      if (err)
      throw err;
      res.redirect("/");
    });
  });

  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });