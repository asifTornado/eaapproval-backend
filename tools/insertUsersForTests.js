const { ObjectId } = require('mongodb');
var db = require('../connection/db');






async function insertTestUsers(){
console.log('entered function')
var departments = ["marketing", "audit", "human resources", "merchandising", "accounts", "administration", "electrical", "mechanical", "PSM-local", "PSM-foreign", "production", "industrial engineering", "PPC", "IT"]

var document = {
    "_id": "051188",
    "empName": "Md. Golam Muktadir Asif",
    "designation": "Management Trainee Officer",
    "mailAddress": "md.asif@hameemgroup.com",
    "unit": "Corporate Office",
    "section": "",
    "wing": "",
    "team": "",
    "groups": [],
    "department": "",
    "userType": "Approver",
    "password": "facebook21",
   }



  try {
     for(var x of departments){
        console.log(`inside loop: ${x}`)
        var randomId = Math.floor(Math.random() * 4901234123123312)
        var mongoId = randomId.toString();
        var result = await db.insertOneUser({

            _id: mongoId,
            empName: `asif_${x}`,
            designation: "Management Trainee Officer",
            mailAddress: `asif_${x}@gmail.com`,
            unit: "Corporate Office",
            section: "",
            wing: "",
            team: "",
            groups: [],
            department: `${x}`,
            userType: "Approver",
            password: "facebook21",

        })
     }
  } catch (error) {
    console.log(error)
  }





}


function runInsertUsers(){
    insertTestUsers().then((result)=>console.log(result)).catch((error)=>console.log(error))
}

runInsertUsers();
