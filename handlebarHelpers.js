var Handlebars = require("handlebars")
var helpers = {
    getUserType(userType){
       if(userType == "Approver" || userType == "Admin" || userType == "Watcher"){
        return  new Handlebars.SafeString(` <div class="hover:cursor-pointer bg-yellow-500 w-44 text-center  border border-solid border-black   text-lg rounded-sm text-white font-bold h-32"  onclick="location.href='/currentRequests'">Current Requests<div ><i class="fa-solid fa-file-import fa-2xl mt-8"></i></div></div>


        <div class="hover:cursor-pointer bg-teal-500 w-44 text-center  border border-solid border-black text-lg rounded-sm text-white font-bold h-32" onclick="location.href='/signature'">Signature<div ><i class="fa-solid fa-signature fa-2xl mt-8"></i></div></div>`)
       }
    },
    getFileType(file){
        console.log()
        console.log(file)
        var ext = "pdf"
        if(ext == "pdf"){
            return '/images/pdf.png'
        }else if(ext == "jpg" || ext == "peg"){
            return '/images/jpg.png'
        }else if(ext == "doc" || ext == "docx" || ext == "odt"){
            return '/images/doc.png'
        }else if(ext == "xlsx"){
            return '/images/xlsx.png'
        }else if(ext == "txt"){
            return '/images/txt.png'
        }else{
            return '/images/folder.png'
        }
    }


}



module.exports = helpers;