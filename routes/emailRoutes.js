var express = require('express');
var router = express.Router();
var {isUserOrAdmin} = require('../middlewares/checker');


router.get('/currentRequests/:id', isUserOrAdmin,  function(req, res){
    var id = req.params.id
    res.render('currentRequests', {id:id})
})



router.get('/myRequests/:id', isUserOrAdmin,  function(req, res){
    var id = req.params.id
    res.render('myRequests', {id:id})
})







module.exports = router;