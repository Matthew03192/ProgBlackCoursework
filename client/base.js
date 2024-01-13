///const { response } = require("express");


const a = document.getElementById("option");
const b = document.getElementById("option2");

async function startsearch(event){
   let response = await fetch('http://127.0.0.1:8090/search');
   if (response.ok){
      document.getElementById('option').innerHTML= response.json
    }
 };

a.addEventListener('click',startsearch)

