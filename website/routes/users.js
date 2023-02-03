var express = require('express');
const { EMPTY } = require('sqlite3');
var router = express.Router();
const db = require("../db/data");
//const fileUpload = require('express-fileupload');

/* GET users listing. */

function checkSession(req,res){
  if(req.session.user_id == null){
    return res.redirect("/home");
    
  }
}
function getDate(){
  let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();
return year + "-" + month + "-" + date + " " + hours + ":" + minutes ;
}

  

    /**
     * new inc.
     */
    router.get("/incident-details", async(req,res)=>{
      console.log("Arraived to details function ..")
      checkSession(req,res);
      console.log("Session Checked ..")
      console.log(req.query.id);
     const item = await db.getById("incidents",req.query.id);
     console.log("item getten from db.. ");
     console.log(item.descreption);
      res.render('employee/emp-report-details', { title: 'Express' , item: item,session: req.session});
    });

    router.post("/incident-update", async(req,res)=>{
      console.log("UPDATE Arraived to details function ..")
      checkSession(req,res);
      console.log("Session Checked .. id is %d",req.body.id)
      const { image } = req.files;
      // Move the uploaded image to our upload folder
      image.mv('./uploads/'+Date.now()+image.name);
      const record = {
        "concernedparty": req.body.concernedparty,
        "comments": req.body.comments,
        "status": req.body.status,
        "city":req.body.city,
        "attachment_url": image.name,
        "descreption":req.body.descreption,
        "id": req.body.id
      };    

     const item = await db.updateIncedent(record);
     console.log("item getten from db.. ");
     console.log(item.descreption);
     if(item !=null)
      return res.redirect("/home",);
    });


    router.get("/assigntome", async(req,res)=>{
      checkSession(req,res);
      console.log(req.query.id);
     const item = await db.updateAssignee(req.session.user_id,req.query.id);
     res.redirect("/home");
    });

    router.get("/new-incident", function(req,res){
      checkSession(req,res);
      res.render('clients/client-new-report', { title: 'Express' , m1: 'Welcome to my Page!',session: req.session});
    });

    router.post("/new-incident", async (req,res)=>{
      checkSession(req,res);
      const { image } = req.files;
      // Move the uploaded image to our upload folder
      
      image.mv('./uploads/'+Date.now()+image.name);
      const item = {
        "owner_id": req.session.user_id,
        "timestamp":getDate(),
        "concernedparty": req.body.concernedparty,
        "assignee": null,
        "comments": null,
        "status": "New",
        "city":req.body.city,
        "attachment_url": image.name,
        "descreption":req.body.descreption
      };    
      const result = await db.insertNewInc(item);
      if(result !=null)
      return res.redirect("/home",);

    });
    

  /**
   * Logout
   */
  router.get("/logout", function(req, res, next){
    req.session.destroy();
    res.redirect("/");
  });
  /**
   * user home page
   */

  
module.exports = router;
