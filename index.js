const express = require('express');
const {initialDatabase} = require('./db/db.connect')
const cors = require('cors');
const jwt = require('jsonwebtoken')

const app = express();
const PORT = process.env.PORT || 3000;

const Project = require("./models/project.model")
const Tag = require("./models/tag.model")
const Task = require("./models/task.model")
const Team = require('./models/team.model')
const User = require('./models/user.model')
initialDatabase()


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const secret = '122333'
const jwt_secret = 'secret'


const verifyToken = (req,res,next) =>{
    const token = req.headers['authorization']
    
    if(!token)
    {
        return res.status(401).json({message:"No token provided"})
    }

    try
    {
        const decodedToken = jwt.verify(token,jwt_secret)
        req.user = decodedToken
    }
    catch(error)
    {
        return res.status(402).json({message:"Inavlid token"})
    }
}



app.get('/projects',async (req,res) =>{
    try{
        const projects = await  Project.find()
        res.status(200).json({message:"Success",projects})
    }
    catch(error)
    {
        console.log(error)
    }
})

app.get('/tasks',async (req,res) =>{
    try{
        const tasks = await Task.find()
            .populate('project')
            .populate('team')
            .populate('owners')
        res.status(200).json({message:"Tasks fetch",tasks})
    } catch(error)
    {
        console.log(error)
    }
})


async function saveNewUser(data){
    try{
        const newUser = new User(data)
        const saveData = await newUser.save()
        return saveData
    } catch(error)
    {
        console.log(error)
    }
}

app.post("/signup",async (req,res) => {
    try{    
        const saveData = await saveNewUser(req.body)
        res.status(201).json({message:"New User Added",saveData})
    } catch(error)
    {
        console.log(error)
    }
})

async function newtask(data)
{
    try{
        const newTask = new Task(data)
        const saveData = await newTask.save()
        return saveData
    } catch(error)
    {
        console.log(error)
    }
}

app.post("/newTask",async (req,res) =>{
    try{
        console.log(req.body)
        const task = await newtask(req.body)
        res.status(201).json({message:"New Task Added",task})
    } catch(error)
    {
        console.log(error)
    }
})

async function searchUser(mail,pass)
{
    try{
        const user = await User.findOne({email:mail})
        // console.log(user.password)
        if(!user)
            {
                return "User Not Found"
            }
        if(user.password == pass)
        {
            return user
        }
        else{
            return "Incorrect password"
        }
    }
    catch(error)
    {
        return error
    }
}

app.post("/signin",async (req,res) =>{
    try{
        const email  = req.body.email
        const pass = req.body.password
        // console.log(email,pass)
        const user = await searchUser(email,pass)
        // console.log(user)
      

        if(user == "Incorrect password" || user == "User Not Found")
        {
            res.status(401).json({error:"Wrong Password || Incorrect credentials"})
        }
        else{
            const token = jwt.sign({email:pass},jwt_secret,{expiresIn:'24hrs'})
            res.status(200).json({message:"User found",token,user})
        }
    }
    catch(error)
    {
       res.status(500).json({message:"Conncetion error"})
    }
})

app.get("/dashboard",verifyToken,(req,res) =>{

    res.status(200).jsonj({message:"Protected Route Accessible"})
})


app.get('/teams',async (req,res) =>{
    const teams = await Team.find()

    res.status(200).json({message:"Success",teams})
})

app.get('/tags',async(req,res) =>{
    const tags = await Tag.find()

    res.status(200).json({message:"Success",tags})
})

app.get('/users',async (req,res) =>{
    const data = await User.find()

    res.status(200).json({message:"Success",data})
})

app.put("/task/:id",async (req,res) =>{
    const id = req.params.id
    const updates = req.body
    const updatedTask = await Task.findByIdAndUpdate(id,updates,{new:true})

    if(updatedTask)
    {
        res.status(200).json({message:"Success",updatedTask})
    }
    else
    {
        res.status(404).json({error:"Update not successfull"})
    }

})


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});