var express = require('express');
var router = express.Router();
const db = require("../db/data");
var sha512 = require('js-sha512');

/* GET home page. */
router.get('/', function(req, res, next) {
if(req.session.user_id == null){
  res.render('loginuser', { title: 'Express' , m1: 'Welcome to my Page!'});
}else{
  res.render('index', { title: 'Express' , m1: 'Welcome to my Page!', session: req.session});
}
  
});


router.get('/home', async(req,res,next)=>{
  await loginUser(req,res,null);
  
});

async function loginUser(req,res,msglogin) {
  console.log("user type id" + req.session.user_type);

  if (req.session.user_id == null) {
    res.render('loginuser', { title: 'Express', msglogin: msglogin });
  } else {
    
    

    var data = [{ btitle: "BLAGH 1" }, { btitle: "BLAGH 2" }];
    if (req.session.user_type == '1') {
      const incidents = await db.getUserIncidents(req.session.user_id);
      res.render('clients/client-home', { title: 'Express', m1: 'Welcome to my Page!', data: incidents, session: req.session });

    } else {
      
      const incedents =await db.getEmpIncidents();
      res.render('employee/emp-incidents', { title: 'Express', m1: 'Welcome to my Page!', data: incedents, session: req.session });
    }
  }
}


router.get('/signup', async(req,res,next)=>{
  if(req.session.user_id != null){
    res.redirect('/home');
  }
  res.render('signup');
});

router.post('/signup',async(req,res,next)=>{
  
  const user = {
    "user_email":req.body.user_email,
    "user_full_name":req.body.user_full_name,
    "user_password_hash":sha512(req.body.user_password),
    "user_id_number":req.body.user_id_number,
    "user_mobile":req.body.user_mobile,
    "user_type":1
  };
  const result = await db.createRecord("users",user);
  res.redirect("/home");
});
/**
   * Login
   */
 router.post("/login", async(req, res,next)=>{
  //console.log(req.body.user_id);
  
  const result = await db.getUserLogin(req.body.user_id,req.body.user_pass);
  if(!result){
   msglogin = "Wrong Info";
   return loginUser(req,res,msglogin);
  }
  console.log(result);
  console.log("userid = %d",result["id"]);
  const incidents = await db.getUserIncidents(result["id"]);
  console.log("number of incedents: %d",incidents.length);
 if(result){
 req.session.user_id = result["id"];
 req.session.user_name = result["user_full_name"];
 req.session.user_type = result["user_type"];
 req.session.user_inceidents = incidents.length;
 console.log(req.session.user_type);

  return res.redirect("/home");
}
  });
module.exports = router;
