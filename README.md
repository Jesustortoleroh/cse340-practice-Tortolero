# cse340-practice-Tortolero
Practice project for CSE 340

## Project Structure
The project files and folders are organized as follows:

```
My-Project/
├── public/
│   ├── css/
│   │   ├── catalog.css
│   │   ├── contact.css
│   │   ├── faculty.css
│   │   ├── login.css
│   │   ├── main.css
│   │   └── registration.css
│   └── images/
│
├── src/
│   ├── controllers/
│   │   ├── catalog/
│   │   │   └── catalog.js
│   │   ├── faculty/
│   │   │   └── faculty.js
│   │   ├── forms/
│   │   │   ├── contact.js
│   │   │   ├── login.js
│   │   │   └── registration.js
│   │   ├── index.js
│   │   └── routes.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── flash.js
│   │   ├── global.js
│   │   └── demo/
│   │       └── headers.js
│   │
│   ├── models/
│   │   ├── catalog/
│   │   │   ├── catalog.js
│   │   │   └── courses.js
│   │   ├── faculty/
│   │   │   └── faculty.js
│   │   ├── forms/
│   │   │   ├── contact.js
│   │   │   ├── login.js
│   │   │   └── registration.js
│   │   ├── sql/
│   │   │   ├── practice.sql
│   │   │   └── seed.sql
│   │   ├── db.js
│   │   └── setup.js
│   │
│   ├── utils/
│   │   └── session-cleanup.js
│   │
│   └── views/
│       ├── catalog/
│       │   ├── detail.ejs
│       │   └── list.ejs
│       ├── faculty/
│       │   ├── detail.ejs
│       │   └── list.ejs
│       ├── errors/
│       │   ├── 404.ejs
│       │   └── 500.ejs
│       ├── forms/
│       │   ├── contact/
│       │   │   ├── form.ejs
│       │   │   └── responses.ejs
│       │   ├── login/
│       │   │   └── form.ejs
│       │   └── registration/
│       │       ├── form.ejs
│       │       └── list.ejs
│       ├── partials/
│       │   ├── head.ejs
│       │   ├── header.ejs
│       │   └── footer.ejs
│       │   
│       ├── about.ejs
│       ├── dashboard.ejs
│       ├── demo.ejs
│       └── home.ejs
│
├── server.js
├── restore.js
├── .env
├── .gitignore
├── nodemon.json
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md         
```