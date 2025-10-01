const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const collection = require('./config');
const Employee = require('./employee');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.post("/signup", async (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password
    }

    const existingUser = await collection.findOne({ username: data.username });

    if (existingUser) {
        return res.send("User already exists. Please choose a different username.");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;

    const userdata = await collection.insertMany([data]);
    console.log(userdata);
    res.redirect("/");
});

app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({ username: req.body.username });
        if(!check){
            return res.status(401).send("user name cannot be found");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){
            const token = jwt.sign({ username: check.username, id: check._id }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({ message: "Login successful!", token });
        }else {
            return res.status(401).send("password is incorrect");
        }
    }catch{
        res.status(401).send("invalid login details");
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

app.use('/employees', authenticateToken);

app.post('/employees', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});