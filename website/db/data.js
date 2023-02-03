const db_ = require("./knex");
var sha512 = require('js-sha512');



/* create a new record */
function createRecord(table_name,record){
return db_(table_name).insert(record);
};

/* get all */
function getAll(table_name){
    return db_(table_name).select("*");
}

/* update record*/
function updateRecord(table_name,id,record){
    return db_(table_name).where(id).update(record);
}

/* delete record*/
function deleteRecord(table_name,id){
    return db_(table_name).where(id).del();
}

/*get by id*/
function getAll(table_name,id){
    return db_(table_name).where(id).select("*");
}

function getById(table_name,id){
    return db_(table_name).where("id","=",id).select("*").first();
}
/**
 * user authentication 
 */
function getUserLogin(user_id,user_pass){
    
    console.log(user_pass);
    const hash = sha512(user_pass);
    console.log(hash);
    return db_("users").where("user_id_number","=",user_id,"user_password_hash","=",hash).first();
}
function updateAssignee(user_id,inced_id){
    console.log("USER ID : %d",user_id);
    console.log("ID OF INC %d",inced_id);
    return db_("incidents")
.update({assignee: user_id, status:"تحت المعالجة"})
.where("id", inced_id);
    
}

function updateIncedent(item){
    return db_("incidents")
.update({
    concernedparty: item.concernedparty,
    assignee: item.user_id, 
    comments: item.comments,
    status:item.status, 
    city: item.city,
    attachment_url: item.attachment_url,
    descreption: item.descreption
})
.where("id", item.id);
    
}
function getUserIncidents(user_id){
   return db_("incidents").where("owner_id","=",user_id).select("*"); 
}
function getEmpIncidents(){
    return db_("incidents").select("*"); 
 }
function insertNewInc(record){
    return db_("incidents").insert(record);
}

module.exports = {
    getAll,
    updateRecord,
    deleteRecord,
    createRecord,
    getUserLogin,
    getUserIncidents,
    insertNewInc,
    getEmpIncidents,
    updateAssignee,
    getById,
    updateIncedent
}