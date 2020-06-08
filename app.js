
////////---------------------MODULES-------////////
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const getJSON = require("./js/login");
const getDate = require("./js/script");
const ejs = require("ejs");

app.use(session({secret:'shh', saveUninitialized:false})); //initializam o sesiune
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));

//const posts=[];
var sess;
var url = "mongodb://localhost:27017/";
///-----------------HOME PAGE------////
app.get("/", function(req, res){
    MongoClient.connect(url,{useUnifiedTopology:true},function(err,db){
		if(err)
		{
			console.log(err);
		}
		else{
			
			var dbo = db.db("BlogDB");
			dbo.collection("posts").find().toArray(function(err,results){
				res.render("home",{data: getDate, newPosts:results,session:req.session.username});
			});
			
			
		}
	});
    

});

app.post('/', (req,res)=>{

    const newPostTitle=req.body.postTitle;
    const newPostBody=req.body.postBody;
    const newPostImage = req.body.imageUrl;
    const day= new Date().getDate();
    const year = new Date().getFullYear();
    const data= new Date();
    const month= data.toLocaleString('en-us',{month:'long'});
    const date = month + " " + day + ","+ year;
    const post={
        Title: newPostTitle,
        Content: newPostBody,
        image:newPostImage,
        date:date
    };
    //posts.push(post);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BlogDB");
        
        dbo.collection("posts").insertOne(post, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
    res.redirect("/");

});

///--------ABOUT PAGE-----////
app.get("/about", function(req,res){
  res.render("about",{data: getDate});
});


///----COMPOSE PAGE------////
app.get('/compose', function(req,res){
    if(req.session.username != undefined)
    {
        res.render('compose',{data: getDate, cookie:req.cookies.utilizator, session:req.session.username});
    }
    else
    {
        res.redirect('/login');
    }
  
});

app.get('/compose/valid', function(req,res){
    res.render('compose',{data: getDate, cookie:req.cookies.utilizator, session:req.session.username});
});


//--- LOGIN PAGE AND VALIDATION----///
app.get('/login', function(req,res){
    res.render('login',{data: getDate, eroare:req.cookies.mesajEroare});
});

app.post('/login', function(req,res){
    const user = req.body.username;
    const pass = req.body.password;
    sess=req.session;
    var dateCorecte = getJSON;
   if(user === dateCorecte[0].utilizator && pass === dateCorecte[0].parola)
   {
       sess.username=user;
      res.cookie("utilizator",user,{expires:new Date(Date.now()+ 1000)});
      res.redirect(302,"http://localhost:3000/compose/valid");
   }
   else
   {
        sess.mesajEroare="Date incorecte";
        res.cookie("mesajEroare","Date incorecte",{expires:new Date(Date.now()+ 1000)});
        res.redirect(302,'http://localhost:3000/login');
       
   }
});


//---POST PAGE-----//
app.get('/posts/:postId',(req,res)=>{

    const requestId = req.params.postId;
    MongoClient.connect(url,{useUnifiedTopology:true},function(err,db){
		if(err)
		{
			console.log(err);
		}
		else{
			
			var dbo = db.db("BlogDB");
			dbo.collection("posts").findOne({"_id": ObjectId(requestId)},function(err,result){
				res.render("post",{title:result.Title,content:result.Content,imagePost:result.image,data: getDate});
			});
			
			
		}
	});


});

//---CONTACT---//
var posted=false;
app.get("/contact", function(req,res){
    res.render("contact",{data: getDate,isPosted:posted});
});
app.post('/contact', (req,res)=>{
    const email=req.body.emailInput;
    const storyContent=req.body.storyPost;

    const story={
        email:email,
        storyContent:storyContent
    };

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("StoryDB");
        
        dbo.collection("stories").insertOne(story, function(err, res) {
          if (err) throw err;
          posted=true;
          
          db.close();
        });
    });

   res.redirect("/contact");
    
    
});

//-----STORIES-----//
app.get("/stories",(req,res)=>{

    MongoClient.connect(url,{useUnifiedTopology:true},function(err,db){
		if(err)
		{
			console.log(err);
		}
		else{
			
			var dbo = db.db("StoryDB");
			dbo.collection("stories").find().toArray(function(err,results){

                res.render('stories',{results:results,data: getDate});
            });
		}
	});

});

app.get("/story/:storyId",(req,res)=>{

    const requestId = req.params.storyId;
    MongoClient.connect(url,{useUnifiedTopology:true},function(err,db){
		if(err)
		{
			console.log(err);
		}
		else{
			
			var dbo = db.db("StoryDB");
			dbo.collection("stories").findOne({"_id": ObjectId(requestId)},function(err,result){
				res.render("story",{content:result.storyContent,data: getDate});
			});
			
			
		}
	});

});

//---SERVER---//
app.listen(3000, function(req,res) {

   console.log("Server started at port 3000"); 
});
