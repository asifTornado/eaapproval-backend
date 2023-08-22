

function getSerial(serial, approvers, infos){

    


    
if(serial == approvers.length){
    return false;
}

 
    
function insertInput(approvers, infos){
    console.log("entered insertInput")
      var newApprovers = [];
      
      for(var x=0; x < approvers.length; x++){
        var newConditions = [];
        console.log("conditions.length");
        console.log(approvers[x].conditions.length)
       for(var y=0; y < approvers[x].conditions.length; y++){
             
        function getIndexOfInfo(info){
             return info.name == approvers[x].conditions[y].info 
        }

        var result = infos.findIndex(getIndexOfInfo);
        console.log("result of get Index Function")
        console.log(result);
        if(result === -1){
            continue;
        }
        var input = infos[result].input;
        var newCondition = approvers[x].conditions[y]
        newCondition["input"] = input;
        newConditions.push(newCondition);
        console.log(newConditions);
}
  var newApprover = approvers[x];
  newApprover["conditions"] = newConditions;
  newApprovers.push(newApprover);
     }
    
     return newApprovers;
   }


   var newApprovers = insertInput(approvers, infos);
   console.log("entered new Approvers")
   console.log(newApprovers);


        
    
    
    
    
    
    
    
function getBooleanData(serialNumber, approvers){
    console.log("entered Boolean Data")
    var initialSerial = serialNumber;
    
      for(var x=initialSerial; x < approvers.length; x++){
        
        
        console.log("entered First For Loop")
        var booleanData = [];

        booleanData.push("(")
        for(var y=0; y < approvers[x].conditions.length ; y++){
            console.log("iteration Number " + y)
            console.log(approvers[x].conditions.length)
            console.log("entered Second For Loop")
        var logic = approvers[x].conditions[y].logic;
        var input = approvers[x].conditions[y].input;
        var dataType = approvers[x].conditions[y].dataType;
        var compareValue = approvers[x].conditions[y].compareValue;
        var link = approvers[x].conditions[y].link;
        var info = approvers[x].conditions[y].info;



        console.log("logic")
        console.log(logic)

        console.log("input")
        console.log(input)

        console.log("link")
        console.log(link)

        console.log("data type")
        console.log(dataType)

        console.log("compare value")
        console.log(compareValue)

       if(link){
        console.log("inside if link")

        if(link == "And"){
        booleanData.push(`) && (`)
    }else{
        booleanData.push(`) || (`)
    }
       }
     
       console.log("outside of if else branch of link")
       console.log(logic)
       console.log(dataType)

        if(logic == "Is Greater Than" && dataType == "number"){


            console.log("inside if 1")
            var intValue = parseInt(compareValue, 10)
            booleanData.push(`${input} > ${intValue}`)

            

        }else if(logic == "Is Less Than" && dataType == "number"){
            console.log("inside if 2")
        
            var intValue = parseInt(compareValue, 10)
            booleanData.push(`${input} < ${intValue}`)
       
            
            
        }else if(logic == "Is Equals To" && dataType == "text"){
            console.log("inside if 3")
            
      
            booleanData.push(`'${input}' == '${compareValue}'`)
      
            


        }else if(logic == "Is Equals To" && dataType == "number"){
            console.log("inside if 4")
            
        
            var intValue = parseInt(compareValue, 10)
            booleanData.push(`${input} == ${intValue}`)
        
            


        }else if(logic == "Is Equals To" && dataType == "selection"){
            console.log("inside if 5")
        
            booleanData.push(`'${input}' == '${compareValue}'`)
         
            


        }else if(logic == "Is Equals To" && dataType == "email"){
            console.log("inside if email")
        
            booleanData.push(`'${input}' == '${compareValue}'`)
         
            


        }else if(logic == "Is Not Equals To" && dataType == "selection"){
            console.log("inside if 5 email ")
        
            booleanData.push(`'${input}' != '${compareValue}'`)
         
            


        }else if(logic == "Is Equals To" && dataType == "time"){
            var inputList = [];
            var compareList = [];
            inputList = input.split(":");
            compareList = compareValue.split(":");
            var inputSecond = (parseInt(inputList[0]) * 60 * 60) + (parseInt(inputList[1]) * 60);
            var compareSecond = (parseInt(compareList[0]) * 60 * 60) + (parseInt(compareList[1]) * 60)
            console.log("inside if time is equals ")
        
            booleanData.push(`${inputSecond} == ${compareSecond}`)
         
            


        }else if(logic == "Is Not Equals To" && dataType == "time"){
            var inputList = [];
            var compareList = [];
            inputList = input.split(":");
            compareList = compareValue.split(":");
            var inputSecond = (parseInt(inputList[0]) * 60 * 60) + (parseInt(inputList[1]) * 60);
            var compareSecond = (parseInt(compareList[0]) * 60 * 60) + (parseInt(compareList[1]) * 60)
            console.log("inside if time is not equals ")
        
            booleanData.push(`${inputSecond} != ${compareSecond}`)
         
            


        }else if(logic == "Is Not Equals To" && dataType == "text"){
            console.log("inside if 6")
            
         
            booleanData.push(`'${input}' != '${compareValue}'`)
         


        }else if(logic == "Is Not Equals To" && dataType == "number"){
            console.log("inside if 7")
            
       
            var intValue = parseInt(compareValue, 10)
            booleanData.push(`${input} != ${intValue}`)
      
            


        }else if(logic == "Is Not Equals To" && dataType == "selection"){
            console.log("inside if 8")
            
        
            booleanData.push(`'${input}' != '${compareValue}'`)
       
            



        }else if(logic == "Is Not Equals To" && dataType == "date"){
            console.log("inside if 8")
            var inputDate = new Date(input);
            var compareValueDate = new Date(compareValue);
            var inputTime = inputDate.getTime();
            var compareValueTime = compareValueDate.getTime();
        
            booleanData.push(`${inputTime} != ${compareValueTime}`)
       
            



        }else if(logic == "Is Equals To" && dataType == "date"){
            console.log("inside if 8")
            
        
            var inputDate = new Date(input);
            var compareValueDate = new Date(compareValue);
            var inputTime = inputDate.getTime();
            var compareValueTime = compareValueDate.getTime();
        
            booleanData.push(`${inputTime} == ${compareValueTime}`)
       
            



        }else if(logic == "Is Greater Than" && dataType == "date"){
            console.log("inside if 8")
            
        
            var inputDate = new Date(input);
            var compareValueDate = new Date(compareValue);
            var inputTime = inputDate.getTime();
            var compareValueTime = compareValueDate.getTime();
        
            booleanData.push(`${inputTime} > ${compareValueTime}`)
       
            



        }else if(logic == "Is Less Than" && dataType == "date"){
            console.log("inside if 8")
            
        
            var inputDate = new Date(input);
            var compareValueDate = new Date(compareValue);
            var inputTime = inputDate.getTime();
            var compareValueTime = compareValueDate.getTime();
        
            booleanData.push(`${inputTime} < ${compareValueTime}`)
       
            



        }else if(logic == "" || info == "" || compareValue == ""){
            console.log("inside if 9")
            booleanData.push("true");
            
            
        }else if(logic == "Any" || info == "Any" || compareValue == "Any"){
            console.log("inside if 10")
            booleanData.push("true");
            
            
        }else{
            console.log("inside final else");
            booleanData.push("true");
            
        }
        console.log("outside of if else branches")

        // if(y == (approvers[x].conditions.length - 1)){
        //     booleanData.push( " ) ");
        // }
    
    } 
    // end of inner loop
    booleanData.push(")")
    console.log("outside of inner loop")
    console.log("boolean data")
   
    
    
   
    console.log(booleanData);
    var conditionString = booleanData.join(" ");
    if(conditionString == "( )" ){
        conditionString = true;
    }
    console.log(conditionString);
    var result = eval(conditionString);

    console.log('Final result')
    console.log(result)

    if(result){
        console.log("inside if final result")
        return initialSerial;
    }else{
        console.log("inside if else of final result")
        initialSerial++
        booleanData = [];
        
        continue;
    }
    

}
    
console.log("outside of final outer loop")

} //end of function get boolean data;

console.log("getting final serial")







var newSerial = getBooleanData(serial, newApprovers);

console.log("final serial")
console.log(serial)
return newSerial;

};
    
    
    
 

    
    
module.exports = getSerial;