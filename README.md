JP Software Solutions Website

A full-stack company website built using HTML, CSS, JavaScript, Python Flask, and MySQL. This project was developed as part of my internship to showcase a professional company portal with user authentication, admin management, internship applications, and contact form functionalities.

🚀 Features

- User Authentication
  
  - Register new users
  - Login system with MySQL database

- Dark / Light Mode
  
  - Theme switching for better user experience

- Admin Module
  
  - Manage and monitor applications and user data

- Internship Application Form
  
  - Users can apply for internships
  - Resume upload support (.pdf, .doc, .docx)

- Job Application Form
  
  - Apply for available job roles with file upload

- Contact Form
  
  - Submit queries/messages directly to the company

- Responsive Design
  
  - Mobile-friendly and modern UI

🛠️ Tech Stack

Frontend

- HTML5
- CSS3
- JavaScript

Backend

- Python
- Flask Framework

Database

- MySQL

📂 Project Structure

JP-Software-Solutions/
│
├── app.py
├── requirements.txt
├── database.sql
│
├── templates/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── contact.html
│   ├── jobs.html
│   ├── internship.html
│   ├── dashboard.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── uploads/
│
└── README.md

⚙️ Installation & Setup

1. Clone the repository

git clone https://github.com/sridevis7/JP-Software-Solutions.git
cd JP-Software-Solutions

2. Install dependencies

pip install -r requirements.txt

3. Setup MySQL database

Run the "database.sql" file in MySQL Workbench or command line.

CREATE DATABASE company_db;
USE company_db;

4. Update database configuration in "app.py"

host="localhost"
user="root"
password="your_password"
database="company_db"

5. Run the project

python app.py

Visit:

http://127.0.0.1:5000/

📌 Future Improvements

- Email notifications for form submissions
- Advanced admin dashboard analytics
- Secure password hashing
- User profile management
- Real-time application status tracking

👨‍💻 Author

Sridevi S
B.Sc Computer Science Student
Software Development Intern
Passionate about Full Stack Development and building scalable web applications.

📜 License

This project is developed for learning and internship purposes.
