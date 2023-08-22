var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";


var db = {
    url:"mongodb://127.0.0.1:27017/",
    getAllRequests: async function(){
        try{
                 var db = await MongoClient.connect(this.url);
                 var dbo =  db.db('eapproval');
                 var result = await dbo.collection("requests").find({}).toArray()
            }catch(error){console.log(error)}
                 db.close();
                 return result
    },
    getSomeRequests: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo =  db.db('eapproval');
        var result = await dbo.collection("requests").find(filter).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    getOneRequest: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo =  db.db('eapproval');
        var result = await dbo.collection("requests").findOne(filter);
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    updateRequest: async function(filter, updateValues){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo =  db.db("eapproval");
        var newValues = { $set: updateValues};
        var result = await dbo.collection("requests").updateOne(filter, newValues)
        }catch(error){console.log(error)}
        db.close();
        if(result){return result;}else{return false;} 
    },
    deleteOneRequest: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo =  db.db("eapproval");
            var result = dbo.collection("requests").deleteOne(filter)
            }catch(error){console.log(error)}
            db.close();
            if(result){return true;}else{return false;} 

    },
    insertOneUser:async function(user){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db('eapproval');
            var result =await dbo.collection("users").insertOne(user);
       }catch(error){console.log(error)}
            db.close();
            return result

    },
    getAllUsers: async function(filter){
        try{
                 var db = await MongoClient.connect(this.url);
                 var dbo = db.db('eapproval');
                 var result =await dbo.collection("users").find(filter).toArray()
            }catch(error){console.log(error)}
                 db.close();
                 return result
    },
    getSomeUsers: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("users").find(filter).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    getOneUser: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("users").findOne(filter);
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    updateUser: async function(filter, updateValues){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db("eapproval");
        var newValues = { $set: updateValues};
        var result =await dbo.collection("users").updateOne(filter, newValues)
        }catch(error){console.log(error)}
        db.close();
        if(result){return true;}else{return false;} 
    },
    deleteOneUser: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db("eapproval");
            var result = await dbo.collection("users").deleteOne(filter);
            }catch(error){console.log(error)}
            db.close();
            if(result){return true;}else{return false;} 

    },
    getAllWorkFlows: async function(){
        try{
                 var db = await MongoClient.connect(this.url);
                 var dbo = db.db('eapproval');
                 var result = await dbo.collection("workflows").find({}).toArray()
            }catch(error){console.log(error)}
                 db.close();
                 return result
    },
    getSomeWorkFlows: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = await db.db('eapproval');
        var result = dbo.collection("workflows").find(filter).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    getOneWorkFlow: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo =  db.db('eapproval');
        var result =  await dbo.collection("workflows").findOne(filter);
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    updateWorkFlow: async function(filter, updateValues){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo =  db.db("eapproval");
        var newValues = { $set: updateValues};
        var result = await dbo.collection("workflows").updateOne(filter, newValues)
        }catch(error){console.log(error)}
        db.close();
        if(result){return true;}else{return false;} 
    },
    deleteOneWorkFlow: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo =  db.db("eapproval");
            var result = await dbo.collection("workflows").deleteOne(filter)
            }catch(error){console.log(error)}
            db.close();
            if(result){return true;}else{return false;} 

    },
    insertWorkFlow: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo =  db.db("eapproval");
            var result = await dbo.collection("workflows").insertOne(filter)
            }catch(error){console.log(error)}
            db.close();
            if(result){return true;}else{return false;} 

    }, 
    // departments
    insertOneDepartment:async function(user){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db('eapproval');
            var result =await dbo.collection("departments").insertOne(user)
       }catch(error){console.log(error)}
            db.close();
            return result

    },
    getAllDepartments: async function(){
        try{
                 var db = await MongoClient.connect(this.url);
                 var dbo = db.db('eapproval');
                 var result =await dbo.collection("departments").find({}).toArray()
            }catch(error){console.log(error)}
                 db.close();
                 return result
    },
    getSomeDepartments: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("departments").find(filter).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    getOneDepartment: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("departments").findOne(filter);
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    updateDepartment: async function(filter, updateValues){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db("eapproval");
        var newValues = { $set: updateValues};
        var result =await dbo.collection("departments").updateOne(filter, newValues)
        }catch(error){console.log(error)}
        db.close();
        if(result){return true;}else{return false;} 
    },
    deleteOneDepartment: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db("eapproval");
            var result = await dbo.collection("departments").deleteOne(filter);
            }catch(error){console.log(error)}
            db.close();
            if(result){return true;}else{return false;} 

    },
    insertAdmin: async function(data){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db("eapproval");
            var result = await dbo.collection("admins").insertOne(data);
            }catch(error){console.log(error)}
            db.close();
            if(result){return result;} 



    },
    getAdmin: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db("eapproval");
            var result = await dbo.collection("admins").findOne(filter);
        }catch(error){console.log(error)}
           if(result){return result;}

    },
    getAdmins: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db("eapproval");
            var result = await dbo.collection("admins").find(filter).toArray();
        }catch(error){console.log(error)}
           if(result){return result;}

    },
    updateAdmin: async function(filter, updateValues){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db("eapproval");
        var newValues = { $set: updateValues};
        var result =await dbo.collection("admins").updateOne(filter, newValues)
        }catch(error){console.log(error)}
        db.close();
        if(result){return true;}else{return false;} 
    },
    // requests
    insertRequest: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo =  db.db("eapproval");
            var result = await dbo.collection("requests").insertOne(filter)
            }catch(error){console.log(error)}
            db.close();
            if(result){return result;}else{return false;} 

    },
    insertApprovedRequest: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo =  db.db("eapproval");
            var result = await dbo.collection("approved_requests").insertOne(filter)
            }catch(error){console.log(error)}
            db.close();
            if(result){return true;}else{return false;} 

    },
    getSomeApprovedRequests: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("approved_requests").find(filter).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    getAllApprovedRequests: async function(){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("approved_requests").find({}).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },

    getApprovedRequest: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db('eapproval');
            var result = await dbo.collection("approved_requests").findOne(filter);
            }catch(error){console.log(error)}
            db.close();
            return result

    },

    
    updateApprovedRequest: async function(filter, updateValues){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db('eapproval');
            var newValues = { $set: updateValues};
            var result = await dbo.collection("approved_requests").updateOne(filter, newValues);
            }catch(error){console.log(error)}
            db.close();
            return result

    },


    
    insertRejectedRequest: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo =  db.db("eapproval");
            var result = await dbo.collection("rejected_requests").insertOne(filter)
            }catch(error){console.log(error)}
            db.close();
            if(result){return result;}else{return false;} 

    },
    getSomeRejectedRequests: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("rejected_requests").find(filter).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    getAllRejectedRequests: async function(){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("rejected_requests").find({}).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    
    getRejectedRequest: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db('eapproval');
            var result = await dbo.collection("rejected_requests").findOne(filter);
            }catch(error){console.log(error)}
            db.close();
            return result

    },

    
    updateRejectedRequest: async function(filter, updateValues){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db('eapproval');
            var newValues = { $set: updateValues};
            var result = await dbo.collection("rejected_requests").updateOne(filter, newValues);
            }catch(error){console.log(error)}
            db.close();
            return result

    },
    deleteRequest: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db("eapproval");
            var result = await dbo.collection("requests").deleteOne(filter);
            }catch(error){console.log(error)}
            db.close();
            if(result){return true;}else{return false;} 

    },  
    deleteRejectedRequest: async function(filter){
        try{
            console.log("inside delete Reject")
            var db = await MongoClient.connect(this.url);
            var dbo = db.db("eapproval");
            var result = await dbo.collection("rejected_requests").deleteOne(filter);
            }catch(error){console.log(error.message)}
            db.close();
            if(result){console.log("result from delete"); console.log(result); return true;}else{return false;} 

    },
    findOneAndUpdateRequest: async function(filter, updateValues){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo =  db.db("eapproval");
        var newValues = { $set: updateValues};
        var result = await dbo.collection("requests").findOneAndUpdate(filter, newValues, {returnNewDocument:true, returnDocument:"after"})
        }catch(error){console.log(error)}
        db.close();
        if(result){return result;}else{return false;} 
    },
    findOneAndUpdateApprovedRequest: async function(filter, updateValues){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo =  db.db("eapproval");
        var newValues = { $set: updateValues};
        var result = await dbo.collection("approved_requests").findOneAndUpdate(filter, newValues, {returnNewDocument:true, returnDocument:"after"})
        }catch(error){console.log(error)}
        db.close();
        if(result){return result;}else{return false;} 
    },
    findOneAndUpdateRejectedRequest: async function(filter, updateValues){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo =  db.db("eapproval");
        var newValues = { $set: updateValues};
        var result = await dbo.collection("rejected_requests").findOneAndUpdate(filter, newValues, {returnNewDocument:true, returnDocument:"after"})
        }catch(error){console.log(error)}
        db.close();
        if(result){return result;}else{return false;} 
    },
    
    
    insertGroup:async function(group){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db('eapproval');
            var result =await dbo.collection("groups").insertOne(group)
       }catch(error){console.log(error)}
            db.close();
            return result

    },
 
    getGroups: async function(){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("groups").find({}).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },


    getSomeGroups: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("groups").find(filter).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },

    getOneGroup: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("group").findOne(filter);
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    updateGroup: async function(filter, updateValues){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db("eapproval");
        var newValues = { $set: updateValues};
        var result =await dbo.collection("groups").updateOne(filter, newValues)
        }catch(error){console.log(error)}
        db.close();
        if(result){return true;}else{return false;} 
    },
    deleteGroup: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db("eapproval");
            var result = await dbo.collection("groups").deleteOne(filter);
            }catch(error){console.log(error)}
            db.close();
            if(result){return true;}else{return false;} 

    },
    insertNotification:async function(group){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db('eapproval');
            var result =await dbo.collection("notifications").insertOne(group)
       }catch(error){console.log(error)}
            db.close();
            return result

    },
 
    getNotifications: async function(){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("groups").find({}).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },


    getSomeNotifications: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("notifications").find(filter).toArray();
        }catch(error){console.log(error)}
        db.close();
        return result
    },

    getNotification: async function(filter){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db('eapproval');
        var result = await dbo.collection("group").findOne(filter);
        }catch(error){console.log(error)}
        db.close();
        return result
    },
    updateNotification: async function(filter, updateValues){
        try{
        var db = await MongoClient.connect(this.url);
        var dbo = db.db("eapproval");
        var newValues = { $set: updateValues};
        var result =await dbo.collection("groups").updateOne(filter, newValues)
        }catch(error){console.log(error)}
        db.close();
        if(result){return true;}else{return false;} 
    },
    deleteNotification: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo = db.db("eapproval");
            var result = await dbo.collection("notifications").deleteOne(filter);
            }catch(error){console.log(error)}
            db.close();
            if(result){return true;}else{return false;} 

    },


    insertFeedBack: async function(filter){
        try{
            var db = await MongoClient.connect(this.url);
            var dbo =  db.db("eapproval");
            var result = await dbo.collection("feedbacks").insertOne(filter)
            }catch(error){console.log(error)}
            db.close();
            if(result){return result;}else{return false;} 

    },

};




module.exports = db;