

Combined Fullstack Web Application

This project is a final assignment for a fullstack web development course. It demonstrates the integration of multiple web applications into a single platform using Node.js, Express, MongoDB, and a modern HTML/CSS frontend. The application includes user authentication and the following features:

- **Blog System**
- **BMI Calculator**
- **Dashboard**
- **QR Code Generator**
- **Send Email**
- **Weather App**

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

### 1. User Authentication
- Register and login with username and password.
- Passwords are securely hashed using bcrypt.
- Session management via redirects (no JWT in frontend, but backend-ready).

### 2. Blog System
- Create, view, and delete blog posts.
- Each post includes a title, content, author, and timestamp.
- Data is stored in MongoDB.

### 3. BMI Calculator
- Input weight (kg) and height (cm) to calculate BMI.
- Displays BMI value and category (Underweight, Normal, Overweight, Obese).

### 4. QR Code Generator
- Enter a URL to generate a QR code image.
- QR code is generated server-side and displayed on the page.

### 5. Send Email
- Send custom emails by specifying recipient, subject, and message.
- Uses Nodemailer for email delivery.

### 6. Weather App
- Enter a city name to get real-time weather data, air quality, and alerts.
- Displays weather info, alerts, and a map of the city.
- Uses external weather APIs.

### 7. Dashboard
- Central navigation hub for all features.
- Overview of all available tools.

---

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Frontend:** HTML, CSS, JavaScript
- **Email:** Nodemailer
- **QR Code:** qr-image
- **Weather:** Axios (for API calls)
- **Other:** dotenv, bcrypt, cors, morgan

---

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Final_Backend-master
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up MongoDB:**
   - Ensure MongoDB is running locally on `mongodb://127.0.0.1:27017/`
   - The app uses two databases: `auth_system` (for users) and `blog` (for blog posts).

4. **Environment Variables:**
   - Create a `.env` file in the root directory if you want to override defaults.
   - Example:
     ```
     JWT_SECRET=your_jwt_secret_key
     MONGO_URI=mongodb://127.0.0.1:27017/blog
     ```

5. **Start the server:**
   ```bash
   node index.js
   ```
   - The app will run on [http://localhost:3000](http://localhost:3000)

---

## Usage

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Register a new user or login with existing credentials.
- Use the dashboard to navigate between features:
  - **Blog:** Create and manage blog posts.
  - **BMI Calculator:** Calculate your BMI.
  - **QR Code:** Generate QR codes for URLs.
  - **Send Email:** Send emails from the platform.
  - **Weather:** Get weather info for any city.

---

## Project Structure

```
Final_Backend-master/
  ├── index.js                # Main server file (Express backend)
  ├── package.json            # Project metadata and dependencies
  └── public/                 # Frontend static files
      ├── blog.html           # Blog system UI
      ├── calculatebmi.html   # BMI calculator UI
      ├── dashboard.html      # Dashboard UI
      ├── login.html          # Login page
      ├── register.html       # Registration page
      ├── qr.html             # QR code generator UI
      ├── sendEmail.html      # Email sending UI
      ├── weather.html        # Weather app UI
      ├── script.js           # Weather app JS logic
      ├── styles.css          # Shared styles
      └── qr-code.png         # Generated QR code image
```

---



## License

This project is for educational purposes as a final assignment for a fullstack web development course.

---

**Credits:**  
Developed as part of the Web Technologies 2 course.  
Uses open-source libraries and APIs.

