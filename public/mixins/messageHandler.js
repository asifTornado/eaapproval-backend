var messageMixin = {
    data:{
      messageText:"",
      messages:[],
      messageCounter:null,
    
  
      

    },

  
    methods:{
        update(elem, counter, id, approval_status){
               var newMessage = elem.innerText;
               console.log("new message");
               console.log(newMessage);
               var timeElem = document.getElementById(counter+"time");
               var nameElem = document.getElementById(counter+"name");
              
               var data = {id:id, message:newMessage, counter:counter, approval_status:approval_status}

               axios.post("/messageEdit", data).then((result)=>{
                console.log(result);
                elem.innerText = result.data.message;
                timeElem.innerText = result.data.time;
                nameElem.innerText = result.data.messengerName; 
                
              
              
              }).catch((error)=>console.log(error.message))
        },

        cancel(parent, div, elem){
          console.log("cancel");
          
          elem.contentEditable = false;
          parent.removeChild(div);
          
        },
        messageSubmit() {
       data = {
        message:this.messageText,
        requestId:this.showRequestItem._id,
        approvalStatus:this.showRequestItem.approval_status
       }
          
              
          
          var vm = this;
          console.log("from the data");
          console.log(data);
            axios.post("/submitMessage", data,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              }, 
            }).then((result)=>{
              vm.messages = result.data;
              console.log("result");
              console.log(result)
              console.log(result.data)
              if(vm.showRequestItem.messages){
                vm.showRequestItem.messages = result.data;
              }else{
                console.log("entered else of getting message")
                vm.$set(vm.showRequestItem, "messages", result.data)
              }
            }).catch((error)=>{
              console.log(error)
            })
          },
        
        messageDelete(messengerId, messageCounter){
          var vm = this;
          console.log("entered message delete")
               var data = {
                messengerId: messengerId,
                messageCounter:messageCounter,
                requestId:this.showRequestItem._id,
                approval_status:this.showRequestItem.approval_status
               }
               console.log(data)
               axios.post("/deleteMessage", data).then((result)=>{
                if(result.data.message==false){
                  console.log(result)
                  
                }else{
                console.log(result);
                vm.showRequestItem = result.data.value;
                vm.messages = result.data.value.messages;
                }
               }).catch((error)=>{
                console.log(error)
               })
        },
        messageEdit(counter, id){
          this.messageCounter = counter;
          var elem = document.getElementById(counter);
          elem.contentEditable = true;
          elem.focus();
          var parent = document.getElementById(counter+"parent");
          var div = document.createElement("div")
          div.id = counter+"child"
          var update = document.createElement('button');
          var cancel = document.createElement('button');
          div.className = "w-full text-white flex flex-row justify-end h-11 mt-2"
          update.innerText = "Update"
          cancel.innerText = "Cancel"
          update.className = "mr-1 bg-blue-400 text-xs p-3 rounded-sm text-white"
          cancel.className = "mr-5 bg-slate-500 text-xs p-3 rounded-sm text-white"
          update.addEventListener('click', (event) => this.update(elem, counter, this.showRequestItem._id, this.showRequestItem.approval_status));
          cancel.addEventListener('click', (event)=> this.cancel(parent, div, elem))
          div.appendChild(update);
          div.appendChild(cancel);
          parent.appendChild(div)
          


        },
     


    }
}