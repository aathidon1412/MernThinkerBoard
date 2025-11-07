Start with
Creating a folder with 2 subfolders called as backend, frontend
Inside the backend directory in the terminal 

'npm init -y' for package.json
'npm i express@4.18.2' for installing express framewor

Create a file server.js for Head of the Backend!!
Code:
    import express from "express"
    const app = express();
    app.listen(5001, ()=>{
        console.log("Server started in port 5001 successfully!!");
    })

Run in the terminal : node server.js

Updations:
    inside package.json :
        remove test inside the scripts
        add dev : "node server.js"
        add type : "module"
    install:
        npm i -D nodemon@3.1.10
    -D means devDependencies
    inside package.json:
        upadate : "nodemon server.js"

Instead of "node server.js" we can use "npm run dev"

Concepts:
    URL,HTTPS,NODEMON,RESTFULLAPI's(GET,POST,PUT/UPDATE,DELETE)

Return to server.js:
//Insert 
    app.get("/api/notes", (req,res) =>{
        res.status(200).send("Hi there Aathi");
    });
    app.post ("/api/notes", (req,res) =>{
        res.status(201).json("Post request is working");
    })
    app.delete ("/api/notes", (req,res) =>{
        res.status(200).json("Delete request is working");
    })
    app.put ("/api/notes/:id", (req,res) =>{
        res.status(200).json("Put request is working"); 
    })

Created a folder routes
Inside routes creating a file called notesRoute.js
Code :
    transfered the api definition from server.js to notesRoutes.js

Just call only the route in the server.js

Create a folder controller
    trabsfered the api defenition from notesRoutes.js to notesController.js

Create a folder config
    create a file db.js :
        initialize MongoDB connection

Create dotenv file ".env" 
    Transfer the Mongo_url and Port to the file for privacy purposes.

Create a folder model:
    Write code for structuring the schema and use timestamp.

Setting up the PostMan API

Inside controlllers start doing the sample operation on all four api's

Checking and verify using postman api

Entering into middleware 
    inside the config create upstash and setting ratelimit
    and create a folder middleware and create a file for check and send the request handling messgage with upstash.js in config

    function call of ratelimiter in server.js

FRONTEND :
    Creating a vite app using the command "npm create vite@latest ."
            

To be Continued Soon..!!