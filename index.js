const express = require("express");
const cors = require('cors')
const users = require("./sample.json");
const fs = require("fs");  //file system make changes in json file


const app = express();
const port = 8000;
app.use(express.json());
// Enable CORS for all origins (during development)
app.use(cors());

// Your other middlewares
app.use(express.json());

//display all users
app.get("/users",(req,res)=>{
    return res.json(users);
});


//delete user detail
app.delete("/users/:id",(req,res)=>{
    let id=Number(req.params.id); //Extracts the id from the URL 
    let filteredUsers = users.filter((user)=>user.id !==id); //keep all users except the one we're trying to delete.
    fs.writeFile("./sample.json",JSON.stringify(filteredUsers),(err, data)=>{   //rewrite data, converts the JS array into a JSON string for writing
        return res.json(filteredUsers);
    }); 
});

//add new user
app.post("/users",(req,res)=>{
    let{name,age,city} = req.body;
    if(!name || !age|| !city){
        res.status(400).send({message:"All fields required!"});
    }
    let id=Date.now();
    users.push({id,name,age,city}); // This adds a new user object to the users array.
    fs.writeFile("./sample.json",JSON.stringify(users),(err, data)=>{   //rewrite data
        return res.json({"message":"User detail added succesfully!"})
    });
   
});

//update user
app.patch("/users/:id",(req,res)=>{
    let id = Number(req.params.id);
    let{name,age,city} = req.body;
    if(!name || !age|| !city){
        res.status(400).send({message:"All fields required!"});
    }
    let index=users.findIndex((user)=>user.id==id); //

    users.splice(index,1,{...req.body}); //splice() is used here to replace the user at index with the new data
    fs.writeFile("./sample.json",JSON.stringify(users),(err, data)=>{   //rewrite data
        return res.json({"message":"User detail updated succesfully!"})
    });
   
});

app.listen(port,(err)=>{
    console.log(`App is running in port ${port}`);
});