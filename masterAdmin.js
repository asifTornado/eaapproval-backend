const prompt = require('prompt-sync')({sigint: true});
const db = require('./connection/db');

var name =  prompt('Name ==> ');

var email =  prompt('Email ==> ');
var password = prompt('Password ==> ');
var againPassword = prompt('Retype Password ==> ');



console.log(name);
console.log(email);
console.log(password);
console.log(againPassword);

var newSuperUser = {empName:name, mailAddress:email, password:password, userType:"Master Admin" }


if(password == againPassword){

db.insertOneUser(newSuperUser);
console.log("Master Admin Created")

}else{
    console.log("Passwords do not match. Please try again")
}