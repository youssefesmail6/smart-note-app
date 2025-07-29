🧠 Smart Note App
A secure Node.js + GraphQL note-taking app with user authentication, file upload, AI-powered summarization, and Docker support.

🚀 Features
🔐 JWT Auth (asymmetric) + Token Revocation

📝 Create/Delete Notes

📊 GraphQL with filters & pagination

📷 Upload Profile Picture (Multer)

🔁 Forget/Reset Password with OTP (Email)

🤖 AI Note Summarizer (OpenAI)

📦 Dockerized & Typedi-based structure

📦 Tech Stack
Node.js, Express, MongoDB, GraphQL

JWT, Bcrypt, Multer, Nodemailer, Joi

OpenAI API, Docker, Typedi, Apollo Server

📁 Project Structure
bash
Copy
Edit
app.ts
/config       → DB, env
/controllers  → REST logic
/graphql      → Types + Resolvers
/models       → Mongoose schemas
/services     → Business logic
/middlewares  → Auth, error handling
/uploads      → Profile images
⚙️ Setup
Clone & install:

bash
Copy
Edit
git clone https://github.com/youssefesmail6/smart-note-app.git
cd smart-note-app
npm install
Add .env (see below)

Run:

bash
Copy
Edit
npm run dev       # Local  
docker build -t smart-note-app . && docker run -p 3000:3000 smart-note-app
📄 .env Example
env
Copy
Edit
PORT=3000
MONGO_URI=mongodb://localhost:27017/smartnote
OPENAI_API_KEY=...
EMAIL_USER=...
EMAIL_PASS=...
PRIVATE_KEY_PATH=./config/private.pem
PUBLIC_KEY_PATH=./config/public.pem
JWT_EXPIRES_IN=1d
🧪 Testing
REST: http://localhost:3000/api/...

GraphQL: http://localhost:3000/graphql

Postman Collection

🔧 Key Endpoints
Auth
Method	Route	Desc
POST	/register	Register user
POST	/login	Login & get token
POST	/logout	Revoke token
POST	/forget-password	Send OTP to email
POST	/reset-password	Reset using OTP
PATCH	/upload-profile-pic	Upload profile picture

Notes
Method	Route	Desc
POST	/notes	Create a note
DELETE	/notes/:id	Delete a note
POST	/notes/:id/summarize	Get AI summary
GET	/graphql	Query notes via GraphQL

