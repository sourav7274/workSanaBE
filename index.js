const express = require('express');
const { initialDatabase } = require('./db/db.connect');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

const Project = require("./models/project.model");
const Tag = require("./models/tag.model");
const Task = require("./models/task.model");
const Team = require('./models/team.model');
const User = require('./models/user.model');
initialDatabase();

const corsOptions = {
    origin:"*",
    credentials: true,
   optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());

const jwt_secret = 'secret';

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decodedToken = jwt.verify(token, jwt_secret);
        req.user = decodedToken;
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        return res.status(402).json({ message: "Invalid token" });
    }
};

// Signup route
async function saveNewUser(data) {
    try {
        const newUser = new User(data);
        const saveData = await newUser.save();
        return saveData;
    } catch (error) {
        console.log(error);
        throw error; // Rethrow the error for the handler to catch
    }
}

app.post("/signup", async (req, res) => {
    try {
        const saveData = await saveNewUser(req.body);
        res.status(201).json({ message: "New User Added", saveData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while creating user" });
    }
});

// Signin route
async function searchUser(mail, pass) {
    try {
        const user = await User.findOne({ email: mail });
        if (!user) {
            return "User Not Found";
        }
        if (user.password === pass) {
            return user;
        } else {
            return "Incorrect password";
        }
    } catch (error) {
        return error;
    }
}

app.post("/signin", async (req, res) => {
    try {
        const email = req.body.email;
        const pass = req.body.password;
        const user = await searchUser(email, pass);

        if (user === "Incorrect password" || user === "User Not Found") {
            return res.status(401).json({ error: "Wrong Password || Incorrect credentials" });
        }

        // Sign token with user email
        const token = jwt.sign({ email: user.email }, jwt_secret, { expiresIn: '24h' });

        res.status(200).json({ message: "User found", token, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Connection error" });
    }
});

// Dashboard route (protected)
app.get("/dashboard", verifyToken, (req, res) => {
    res.status(200).json({ message: "Protected Route Accessible", user: req.user });
});

// Project routes
app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json({ message: "Success", projects });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching projects" });
    }
});

// Task routes
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('project')
            .populate('team')
            .populate('owners');
        res.status(200).json({ message: "Tasks fetched", tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

// Teams, Tags, and Users routes
app.get('/teams', async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json({ message: "Success", teams });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching teams" });
    }
});

app.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(200).json({ message: "Success", tags });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching tags" });
    }
});

app.get('/users', async (req, res) => {
    try {
        const data = await User.find();
        res.status(200).json({ message: "Success", data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Task update route
app.put("/task/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

        if (updatedTask) {
            res.status(200).json({ message: "Success", updatedTask });
        } else {
            res.status(404).json({ error: "Update not successful" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating task" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
