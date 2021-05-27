require('dotenv').config();     //Level 3 encrypt
const express=require('express'),
      app = express(),
      port = 5000||process.env.PORT,
      mongoose = require('mongoose'),
      ejs = require('ejs'),
      encrypt = require('mongoose-encryption');

app.use(express.urlencoded({extended:true})) ;
app.use (express.static('public'));
app.set('view engine','ejs');
mongoose.connect('mongodb://localhost:27017/userData',{useNewUrlParser:true,useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true},
    password:{
        type:String,
        required:true}
});


userSchema.plugin(encrypt, { secret:process.env.DB_PASS ,encryptedFields: ['password']});

const User = mongoose.model('User',userSchema);

app.route('/')
    .get(function(req,res){
        res.render('home');
    });



app.route('/register')
    .get(function(req,res){
        res.render('register');
    })
    .post(function(req,res){
        
        const username = req.body.username;
        const password = req.body.password;
        const newUser = new User({
            username:username,
            password:password
        });
        newUser.save();
        res.redirect('/');
});

app.route('/login')
    .get(function(req,res){
        res.render('login');
    })
    .post(function(req,res){
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({username:username},function(err,foundUser){
            if(err) console.log(err);
            else{
                if(!foundUser) res.send('Please register First!')
                else if(foundUser){
                    if(foundUser.password===password){
                        res.render('secrets');
                    }
                    else{
                        res.send('Incorrect Credentials Provided!!')
                    }
                }
                
            }
        })
    });


app.listen(port);

