var db = require('../connection/db')
var axios = require('axios')
var fs = require('fs')




function insertUsers(){


    const url = 'http://192.168.0.11:8420/api/Emloyees';
    const companyId = 1;
    const apiKey = '27d34740-c3d4-4938-9260-b5ba3a62922c';
    var finalUsers = null
    var approversList = ["Manager", "Senior Manager", "Deputy Manager", "Assistant Manager", "Assistant General Manager", "Deputy General Manager", "General Manager", "Senior General Manager", "Executive Director", "Senior Executive Director", "Director", "Managing Director", "Chairman"]

    axios
  .get(url, {
    params: {
      companyid: companyId
    },
    headers: {
      'X-API-KEY': apiKey
    }
  })
  .then(async function(response){
    // Handle the response data
         var user = response.data;
         var mappedUsers = response.data.map((item)=>{
            item._id = item.empCode;
            if(approversList.includes(item.designation)){
                item.userType = "Approver"
            }else{
                item.userType = "Watcher"
            }
            
            return item

         })

        console.log(mappedUsers)

        var jsonContent = JSON.stringify(mappedUsers)
       

        fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
         
            console.log("JSON file has been saved.");
        });

   





         
  })
  .catch(error => {
    // Handle any errors
    console.error(error);
  });
  

  console.log(finalUsers)

}

insertUsers()