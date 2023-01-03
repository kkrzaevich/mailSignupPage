const express = require('express');
const bodyParser = require('body-parser');
// const request = require('request');
const app = express();
const https = require('https');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req,res)=> {
    res.sendFile(__dirname + '/signup.html');
})

let firstName;
let lastName;
let inputEmail;

app.post('/', (req,res) => {
    firstName = req.body.firstName;
    lastName = req.body.lastName;
    inputEmail = req.body.inputEmail;

        
    let data = {
        members: [
            {
                email_address: inputEmail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = 'https://us13.api.mailchimp.com/3.0/lists/670ba2cd64'

    const options = {
        method: "POST",
        auth: "konstantin:17905a453df6d10664caeb6d488d0e8f-us13"
    }
        const request = https.request(url, options, function(response) {
            if (response.statusCode === 200) {
                console.log(response.statusCode);
                res.sendFile(__dirname + '/success.html');
            } else { 
                console.log(response.statusCode);
                res.sendFile(__dirname + '/failure.html');
            };
           
            response.on('data', function(data) {
                // console.log(JSON.parse(data));
            })

        })
    
    request.write(jsonData);
    request.end();
    // if (res.statusCode === 200) {
    //     res.sendFile(__dirname + '/failure.html');
    //     console.log(res.statusCode);
    // } else 
    // { res.sendFile(__dirname + '/failure.html');
    // };
})

app.post('/failure', (req,res) => {
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, ()=> {
    console.log('Listening on port 3000');
})