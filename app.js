
const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./models/user");
      var fs = require('fs');
var path = require('path');
  //Connecting database
mongoose.connect("mongodb+srv://<username>:<password>@cluster0.9irto.mongodb.net/AuraDB");
app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}));
passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
//=======================
//      R O U T E S
//=======================
app.get("/", (req,res) =>{
    res.render("index");
})
app.get("/dashboard",isLoggedIn ,(req,res) =>{
    const query = { "userid": req.user.username};
    Friend.find(query,function(err, friends){
    res.render("dashboard",{NewUser: req.user.username,friendsdetails:friends,ImageContent:req.user.img.contentType,ImageData:req.user.img.data.toString('base64')});
});
});
//Auth Routes
app.get("/index",(req,res)=>{
    res.render("index");
});
app.post("/index",passport.authenticate("local",{
    successRedirect:"/dashboard",
    failureRedirect:"/index"
}),function (req, res){});
app.post("/index",(req,res)=>{
//console.log(req.body.username);
});
app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/posts",(req,res)=>{
    const query = { "userid": req.user.username};
    Photo.find(query,function(err,photos){
        res.render("posts",{NewUser: req.user.username,postdetails:photos,ImageContent:req.user.img.contentType,ImageData:req.user.img.data.toString('base64')})
    });
    });
    app.get("/searchposts",(req,res)=>{
        
        });
        app.post("/searchposts",(req,res)=>{
         const query={"userid":req.body.search1};
         Photo.find(query,function(err,photos){
            res.render("searchposts",{NewUser: req.user.username,postdetails:photos,ImageContent:req.user.img.contentType,ImageData:req.user.img.data.toString('base64')})
        });   
        })
app.get("/profile",function(req,res){
    const query = { "userid": req.user.username};
    Friend.find(query,function(err,friends){
    following=friends.length;    
    //console.log(following);
    });
    const query1={"friendname":req.user.username};
    Friend.find(query1,function(err,friends){
        followers=friends.length;    
        //console.log(followers);
        });  
    Comment.find(query,function(err,comments){
    commentdetails=comments;
    });    
    Tweet.find(query,function(err, tweets){
    //db.collection("tweets",function(err,collection))
    res.render("profile",{NewUser: req.user.username,tweetsdetails:tweets,commentdetails:commentdetails,following:following,followers:followers,ImageContent:req.user.img.contentType,ImageData:req.user.img.data.toString('base64')});
}); });
app.get("/editprofile",(req,res)=>{
    res.render("editprofile",{NewUser: req.user.username,ImageContent:req.user.img.contentType,ImageData:req.user.img.data.toString('base64')});
});
app.get("/personalinfo",(req,res)=>{
    res.render("personalinfo",{NewUser: req.user.username,phno:req.user.phone,email:req.user.mail,dob:req.user.dob,ImageContent:req.user.img.contentType,ImageData:req.user.img.data.toString('base64')});
});
var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });
app.post("/register",upload.single('image'),(req,res)=>{
    
    User.register(new User({username: req.body.username,fullname:req.body.fullname,dob:req.body.dob,phone:req.body.phone,mail: req.body.mail,img: {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    }}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/index");
    })    
    })
});
app.post("/editprofile1",(req,res)=>{
    newuname=req.body.nusername;
    User.updateOne({username:req.user.username},{username:newuname},function(err){
        if(err)
        console.log(err);
        else
        {console.log("suceesfully updated");
         res.redirect("/index");
         //res.render("editprofile",{NewUser: req.user.username});
    }

    });
});
app.post("/editprofile2",(req,res)=>{
    nemail=req.body.nmail;
    User.updateOne({mail:req.user.mail},{mail:nemail},function(err){
        if(err)
        console.log(err);
        else
        {console.log("suceesfully updated");
         res.redirect("/profile");
         
    }

    });
});
app.post("/editprofile3",(req,res)=>{
    
    newnum=req.body.num;
    User.updateOne({phone:req.user.phone},{phone:newnum},function(err){
        if(err)
        console.log(err);
        else
        {console.log("sucessfully updated");
         res.redirect("/profile");
         
    }

    });
});
app.post("/deleteaccount",(req,res)=>{
    
    User.deleteOne({username:req.user.username},function(err){
        if(err)
        console.log(err);
        else
        {
            console.log("successfully deleted");
            res.redirect("/index");
        }
    });
});
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/index");
}
const TweetSchema = new mongoose.Schema({
    userid:String,
    tweetname:String,
    tweet:String,
}) ;
const Tweet=mongoose.model("Tweet",TweetSchema);
app.post("/tweets",upload.single('image'),function(req, res, next){

    const tweet=new Tweet({
        userid:req.user.username,
        tweetname:req.body.tweetname,
        tweet:req.body.tweet
    });
    tweet.save();
    Friend.updateMany({friendname:req.user.username},{"$push": { "tweetname": req.body.tweetname,"tweet":req.body.tweet }},function(err){
        if(err)
        console.log(err);
        else
        console.log("suceesfully updated");
    });
    res.redirect("profile");   
    });
const CommentSchema=new mongoose.Schema({
    userid:String,
    tweetname:String,
    by:String,
    comment:String,
});
const Comment=mongoose.model("Comment",CommentSchema);
app.post("/comments",function(req, res, next){

    const comment=new Comment({
        userid:req.body.userid,
        tweetname:req.body.tweetname,
        by:req.user.username,
        comment:req.body.comment
    });
    
    comment.save();
    res.redirect("dashboard");   
    });
    const PhotoSchema = new mongoose.Schema({
        userid:String,
        img:
            {
                data: Buffer,
                contentType: String
            }
    }) ;
    const Photo =mongoose.model("Photo",PhotoSchema);
    app.post("/myposts",upload.single('image'),function(req, res, next){

        const photo=new Photo({
            userid:req.user.username,
            img: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        });
        
        photo.save();
        res.redirect("profile");   
        });
    
app.post("/userprofile",function(req,res){
    const query = { "userid": req.body.search};
    Friend.find(query,function(err,friends){
    following1=friends.length;    
    //console.log(following);
    });
    const query1={"friendname":req.body.search};
    Friend.find(query1,function(err,friends){
        followers1=friends.length;    
        //console.log(followers);
        });
    Tweet.find(query,function(err, tweets){
    //db.collection("tweets",function(err,collection))
    tweetdetails=tweets;});
    const query2={"username":req.body.search};
    User.find(query2,function(err,users){   
    res.render("userprofile",{NewUser: req.user.username,searchedUser:users,
    tweetsdetails:tweetdetails,following:following1,followers:followers1,ImageContent:req.user.img.contentType,
    ImageData:req.user.img.data.toString('base64')});
}); });
const FriendSchema = new mongoose.Schema({
    userid:String,
    friendname:String,
    tweetname:Array,
    tweet:Array,
}) ;
const Friend=mongoose.model("Friend",FriendSchema);
app.post("/friends",function(req,res){
    const friend=new Friend({
        userid:req.user.username,
        friendname:req.body.friend, 
        tweetname:req.body.tweetname,
        tweet:req.body.tweet
        
});
friend.save();
res.redirect("/dashboard");
});
app.get("/friends",function(req,res){
    const query = { "userid": req.user.username};
    Friend.find(query,function(err, friends){
    res.render("friends",{NewUser: req.user.username,friendsdetails:friends,ImageContent:req.user.img.contentType,ImageData:req.user.img.data.toString('base64')});
    
    });});
    app.post("/deletefriend",function(req,res){
        const query = { "userid": req.user.username,"friendname":req.body.deletefriend};
        Friend.findOneAndRemove(query,function(err){
            if(!err){
                console.log("succesfully deleted checked item");
                res.redirect("/friends");
            }
        
        });
    });
    app.get("/chatsystem",function(req,res){
        const query = { "userid": req.user.username};
        Friend.find(query,function(err, friends){
        res.render("chatsystem",{NewUser: req.user.username,friendsdetails:friends,ImageContent:req.user.img.contentType,ImageData:req.user.img.data.toString('base64')});
        
        });});
    var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection', () =>{
    console.log('a user is connected');
   });
      const MessageSchema = new mongoose.Schema({
        from:String,
        to:String,
        message:String,
    }) ;
    const Message=mongoose.model("Message",MessageSchema);
    app.post('/sendmessages', (req, res) => {
        const query = { "from": req.user.username,"to":req.body.friend};
        const query1={"from":req.body.friend,"to":req.user.username};
        Message.find(query1,function(err,messages){
            messagefromdetails=messages;
        });
          Message.find(query,function(err,messages){
          res.render("sendmessages",{messagedetails:messages,messagefromdetails:messagefromdetails,NewUser: req.user.username,ImageContent:req.user.img.contentType,ImageData:req.user.img.data.toString('base64'),friendname:req.body.friend});
          });
        });
      app.get('/sendmessages', (req, res) => {
        const query = { "from": req.user.username,"to":req.body.friend};
        const query1={"from":req.body.friend,"to":req.user.username};
        Message.find(query1,function(err,messages){
            messagefromdetails=messages;
        });
          Message.find(query,function(err,messages){  
        res.render("sendmessages",{messagedetails:messages,messagefromdetails:messagefromdetails,NewUser: req.user.username,ImageContent:req.user.img.contentType,ImageData:req.user.img.data.toString('base64'),friendname:req.body.friend});
    });
});
    app.post("/storemessage",(req,res)=>{
           var message = new Message({
            from:req.body.from,
            to:req.body.to,
            message:req.body.message
        }); 
        message.save();
        res.redirect("/chatsystem");
});
    
//Listen On Server
app.listen(process.env.PORT ||3000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 3000");
    }
      
});





































// app.post("/editprofilepsw",(req,res)=>{
//     newpwd=req.body.npwd;
//     User.findOne({ _id: user.req._id},(err, user) => {
//         // Check if error connecting
//         if (err) {
//           res.json({ success: false, message: err }); // Return error
//         } else {
//           // Check if user was found in database
//           if (!user) {
//             res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
//           } else {
//             user.changePassword(req.user.password,newpwd, function(err) {
//                if(err) {
//                         if(err.name === 'IncorrectPasswordError'){
//                              res.json({ success: false, message: 'Incorrect password' }); // Return error
//                         }else {
//                             res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
//                         }
//               } else {
//                 res.redirect("/index");
//                }
//              })
//           }
//         }
//       }); });
