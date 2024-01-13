const express = require('express')
const app = express()
app.use(express.static('client'));
app.use(express.json());

let searchHTML = "<div class='mb-3'><label for='exampleFormControlInput1' class='form-label'>Email address</label><input type='email' class='form-control' id='exampleFormControlInput1' placeholder='name@example.com'></div>;";
app.get('/search', function (req, resp){
    resp.send(searchHTML);
 });


app.listen(8090)