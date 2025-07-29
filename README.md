🧠 Smart Note App
A secure Node.js + GraphQL note-taking app with user authentication, profile uploads, AI-powered summarization, and Docker support.

🚀 Features
🔐 JWT Auth (asymmetric) + Token Revocation

📝 Create/Delete Notes

📊 GraphQL Notes Query with Filters & Pagination

📷 Upload Profile Picture (Multer, safe filename handling)

🔁 Password Reset via OTP (Email-based)

🤖 AI Note Summarizer using OpenAI API

🛡️ Security Middleware: Rate Limiter, Helmet, CORS

🐳 Dockerized for Easy Deployment

📦 Tech Stack
Node.js, Express, MongoDB, GraphQL (Apollo)

JWT (RSA), Bcrypt, Joi, Multer, Nodemailer

OpenAI API, Docker, Typedi, dotenv

📁 Project Structure
bash
Copy
Edit
app.ts
/config         → Env, DB, keys
/controllers    → REST API logic
/graphql        → TypeDefs & Resolvers
/models         → Mongoose Schemas
/services       → Auth, Notes, Email, AI
/middlewares    → Auth, RateLimiter, Error Handling
/uploads        → Profile Images
⚙️ Local Setup
bash
Copy
Edit
git clone https://github.com/youssefesmail6/smart-note-app.git
cd smart-note-app
npm install
npm run dev
🐳 Docker Setup
Dockerfile

dockerfile
Copy
Edit
FROM satantime/puppeteer-node:20.9.0-buster-slim

COPY . ./app
WORKDIR /app

RUN npm install
ENV NODE_ENV=development

EXPOSE 3000
CMD ["npm", "run", "dev"]
Build & Run

bash
Copy
Edit
docker build -t smart-note-app .
docker run -p 3000:3000 smart-note-app
📄 .env Example
env
Copy
Edit
PORT=3000
MONGO_URI=mongodb://localhost:27017/smartnote
OPENAI_API_KEY=sk-...
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
PRIVATE_KEY_PATH=./config/private.pem
PUBLIC_KEY_PATH=./config/public.pem
JWT_EXPIRES_IN=1d
🧪 Testing
REST: http://localhost:3000/api/...

GraphQL: http://localhost:3000/graphql

Postman Collection: included in repo

🔐 Security Middleware
Helmet – Sets secure HTTP headers

CORS – Restricts external origins

Rate Limiter – Prevents abuse (e.g., login brute-force)

🔧 Key Endpoints
Auth
Method	Route	Description
POST	/register	Register a new user
POST	/login	Authenticate user
POST	/logout	Revoke login token
POST	/forget-password	Send OTP to email
POST	/reset-password	Reset password via OTP
PATCH	/upload-profile-pic	Upload a safe profile image

Notes
Method	Route	Description
POST	/notes	Create a new note
DELETE	/notes/:id	Delete user-owned note
POST	/notes/:id/summarize	Get AI summary of a note
GET	/graphql	Query notes with filters
