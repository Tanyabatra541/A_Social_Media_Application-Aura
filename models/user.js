const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    username:String,
    fullname:String,
    dob:String,
    phone:Number,
    mail:String,
    password:String,
    img:
    {
        data: Buffer,
        contentType: String
    }
}) ;
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);
// const TweetSchema = new mongoose.Schema({
//     userid:UserSchema,
//     tweetnaame:String,
//     tweet:String
// }) ;
// module.exports = mongoose.model("Tweet",TweetSchema);