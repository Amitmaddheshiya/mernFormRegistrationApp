# My Express App - User Authentication System

Ye project ek **User Authentication System** hai jisme users ko registration, login, password reset aur secret page access karne ki suvidha di gayi hai. Yeh backend Express.js aur MongoDB ka use karta hai aur Handlebars templates ko frontend ke liye use karta hai.

## Features

- **User Registration**: Naye users apna account bana sakte hain.
- **User Login**: Registered users apne account mein login kar sakte hain.
- **Forgot Password**: Agar user apna password bhool gaya hai, toh wo password reset kar sakte hain.
- **Reset Password**: User apna password reset kar sakte hain.
- **Secret Page**: Authenticated users ko ek secret page dikhayi jaati hai.
- **Error Handling**: Har error ko handle kiya gaya hai aur proper messages dikhayi jaati hain.
- **Middleware**: Authentication middleware ka use kiya gaya hai jo users ke access ko secure karta hai.

## Tech Stack

- **Node.js** (Backend)
- **Express.js** (Framework)
- **MongoDB** (Database)
- **Handlebars** (Frontend Template Engine)
- **bcryptjs** (Password Encryption)
- **jsonwebtoken (JWT)** (Authentication Token)

## Project Setup

### Prerequisites

Is project ko chalane ke liye aapko kuch dependencies aur tools ki zarurat padegi:

- **Node.js**: Apne system mein Node.js install hona chahiye. Aap [Node.js official website](https://nodejs.org/) se installation guide follow kar sakte hain.
- **MongoDB**: Is project mein MongoDB ka use kiya gaya hai. Agar aap apne local machine par MongoDB chalana chahte hain, toh [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/installation/) ko follow kar sakte hain. Aap **MongoDB Atlas** ka use bhi kar sakte hain cloud database ke liye.

### Steps to Run the Project

1. **Clone the Repository:**

   Sabse pehle aap project ko apne local machine par clone karen:

   ```bash
   git clone https://github.com/your-username/my-express-app.git
