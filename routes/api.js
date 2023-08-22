const express = require('express');
const axios = require('axios');
var router = express.Router();



router.get('/api/getUsers', async function(req, res){
   
    const url = 'http://192.168.0.11:8420/api/Emloyees';
        const companyId = 1;
        const apiKey = '27d34740-c3d4-4938-9260-b5ba3a62922c';

		axios
      .get(url, {
        params: {
          companyid: companyId
        },
        headers: {
          'X-API-KEY': apiKey
        }
      })
      .then(response => {
        // Handle the response data
        res.send(response.data);
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });




})









module.exports = router;