require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const qr = require("qr-image");
const cors = require("cors");
const morgan = require("morgan");
const API_KEY = 'e1b292964b3c86ad361260f80c9496e0';

const app = express();
const PORT = 3000;
const JWT_SECRET = "your_jwt_secret_key";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/auth_system", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));
app.get("/sendEmail", (req, res) => res.sendFile(path.join(__dirname, "public", "sendEmail.html")));
app.get("/calculatebmi", (req, res) => res.sendFile(path.join(__dirname, "public", "calculatebmi.html")));
app.get("/qr", (req, res) => res.sendFile(path.join(__dirname, "public", "qr.html")));
app.get("/blog", (req, res) => res.sendFile(path.join(__dirname, "public", "blog.html")));
app.get("/weather", (req, res) => res.sendFile(path.join(__dirname, "public", "weather.html")));

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send('Registration successful. <a href="/">Login here</a>');
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: "Username already exists" });
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid username or password" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid username or password" });

        res.redirect("/dashboard"); // Redirect to dashboard
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/sendEmail", async (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
                user:"toktarov.nurislam@bk.ru",
                pass:"wvucsRW1GUUfCmptmZnv",
            },
        });

        const mailOptions = {
            from: "toktarov.nurislam@bk.ru",
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        res.json({ message: `Email sent successfully! ID: ${info.messageId}` });
    } catch (error) {
        res.status(500).json({ message: `Error sending email: ${error.message}` });
    }
});
app.post('/calculatebmi', (req, res) => {
    const { weight, height } = req.body;

    if (!weight || !height || weight <= 0 || height <= 0) {
        return res.status(400).json({ message: "Invalid weight or height." });
    }

    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
    let category = '';

    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 18.5 && bmi < 24.9) category = 'Normal weight';
    else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
    else category = 'Obese';

    res.json({ bmi, category });
});
app.post("/generate-qr", (req, res) => {
    const { url } = req.body;

    if (!url) return res.status(400).json({ message: "URL is required" });

    const qrCode = qr.image(url, { type: "png" });
    const filePath = path.join(__dirname, "public", "qr-code.png");

    qrCode.pipe(fs.createWriteStream(filePath));

    qrCode.on("end", () => {
        res.json({ message: "QR code generated", qrImage: "/qr-code.png" });
    });

    qrCode.on("error", (err) => {
        res.status(500).json({ message: `Error generating QR code: ${err.message}` });
    });
});
const MONGO_URI = "mongodb://127.0.0.1:27017/blog";
const blogDb = mongoose.createConnection(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

blogDb.on("error", (err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
});

blogDb.once("open", () => {
    console.log("Connected to MongoDB for Blogs");
});

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: String, default: "Anonymous" }
}, { timestamps: true });

const Blog = blogDb.model("Blog", blogSchema);


app.post("/blogs", async (req, res) => {
    try {
        const { title, body, author } = req.body;
        if (!title || !body) return res.status(400).json({ error: "Title and body are required" });

        const blog = new Blog({ title, body, author });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/blogs/:id", async (req, res) => {
    try {
        const { title, body, author } = req.body;
        const blog = await Blog.findByIdAndUpdate(req.params.id, { title, body, author }, { new: true });
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'Укажите название города в параметре запроса ?city=...' });
    }

    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric',
            },
        });

        const { name, sys, main, weather, wind, coord } = response.data;
        const countryCode = sys.country;

        // Fetch Air Quality Data
        const aqiResponse = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
            params: {
                lat: coord.lat,
                lon: coord.lon,
                appid: API_KEY,
            },
        });

        const aqiValue = aqiResponse.data.list[0].main.aqi;
        const aqiCategories = ["Очень низкое", "Низкое", "Умеренное", "Высокое", "Очень высокое"];
        const aqiCategory = aqiCategories[aqiValue - 1];

        const weatherInfo = {
            city: name,
            country: countryCode,
            temperature: main.temp,
            feels_like: main.feels_like,
            description: weather[0].description,
            icon: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
            humidity: main.humidity,
            pressure: main.pressure,
            wind_speed: wind.speed,
            coordinates: {
                latitude: coord.lat,
                longitude: coord.lon,
            },
            aqi: aqiValue,
            aqi_category: aqiCategory,
        };

        res.json(weatherInfo);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message });
        } else {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
});

app.get('/api/weather/alerts', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'Укажите название города в параметре запроса ?city=...' });
    }

    try {
        const response = await axios.get('https://global-weather-alerts-api.p.rapidapi.com/alerts.json', {
            params: { q: city },
            headers: {
                'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY',
                'x-rapidapi-host': 'global-weather-alerts-api.p.rapidapi.com',
            },
        });

        const alerts = response.data.alerts || [];
        res.json(alerts);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message });
        } else {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
