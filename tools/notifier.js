var db = require('../connection/db')





exports.sendNotification = async function(email, event, id, user, requestType){
   console.log("notification fired")
   try {
      var currentDate = new Date();
      const options = { timeZoneOffset: -360, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      var time = currentDate.toLocaleString('en-US', options);
      var result = await db.insertNotification({name:email, event:event, eventId:id, time:time, requestType:requestType, userName:user.empName})
   } catch (error) {
     console.log(error)
   }
   
}





