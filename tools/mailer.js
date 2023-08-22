"use strict";
const nodemailer = require("nodemailer");
const db = require('../connection/db')
var config = require('../config')

// async..await is not allowed in global scope, must use a wrapper


exports.event = {
  Approved:"Approved",
  Rejected:"Rejected",
  Request:"Request",
  Defer:"Defer"
}





exports.sendMail = async function(to, event, id, user, requestType) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "md.asif@hameemgroup.com",
      pass: "Golam@HG#$188",
    },
  });



  var subject = ""

  var html = ""
 

  switch (event) {
    case "Approved":
      subject = "Your Request Has been Approved";
      
      html = `
      <p>Your ${requestType} request with the id: ${id} has been approved </p>
      <a href='${config.frontHost}email/myRequests/notRejected/${id}' style='text-decoration: underline; color:dodgerblue'> Check </a>`
      break;

    case "Rejected":
      subject = "Your Request Has been Rejected"
     
      html =  `
      <p>Your ${requestType} request with the id: ${id} has been rejected by ${user.empName} </p>
      <a href='${config.frontHost}email/myRequests/rejected/${id}' style='text-decoration: underline; color:dodgerblue'>Check </a>`

     break;

    case "Request":
      subject = "You have received a new request"
      html =  `
      <p>You have received a ${requestType} request with the id: ${id} from ${user.empName}  </p>
      <a href='${config.frontHost}email/currentRequests/view/${id}' style='text-decoration: underline; color:dodgerblue'>Check </a>`


     break


     
  
    default:
      break;
  }



  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "md.asif@hameemgroup.com", // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}



exports.sendMailByDepartmentOrGroup = async function(current_approver, event, id, user, requestType) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  

  // create reusable transporter object using the default SMTP transport
  console.log("current Appprover")
  console.log(current_approver)
  try {
    var result = await db.getAllUsers();
    var realResults = result.filter(function(item){
      return( (item.department == current_approver) || (item.groups && item.groups.includes(current_approver))  )
    })
    console.log("result");
    console.log(realResults);
   
  } catch (error) {
    console.log(error.message)
  }

  var mailList = [];

  for(let x of realResults){
    mailList.push(x.email)
  }

  console.log(mailList)
  
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "md.asif@hameemgroup.com",
      pass: "Golam@HG#$188",
    },
  });



  var subject = ""
  var html = ""
 

  switch (event) {
    case "Approved":
      subject = "Your Request Has been Approved";
      
      html = `
      <p>Your ${requestType} request with the id: ${id} has been approved </p>
      <a href='${config.frontHost}email/myRequests/notRejected/${id}' style='text-decoration: underline; color:dodgerblue'> Check </a>`
      break;

    case "Rejected":
      subject = "Your Request Has been Rejected"
     
      html =  `
      <p>Your ${requestType} request with the id: ${id} has been rejected by ${user.empName} </p>
      <a href='${config.frontHost}email/myRequests/rejected/${id}' style='text-decoration: underline; color:dodgerblue'>Check </a>`

     break;

    case "Request":
      subject = "You have received a new request"
      html =  `
      <p>You have received a ${requestType} request with the id: ${id} from ${user.empName}  </p>
      <a href='${config.frontHost}email/currentRequests/view/${id}' style='text-decoration: underline; color:dodgerblue'>Check </a>`


     break


     
  
    default:
      break;
  }



  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "md.asif@hameemgroup.com", // sender address
    to: mailList, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


