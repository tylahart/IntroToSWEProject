This is a full-stack MERN application for handling user authentication and waste data management.

Prerequisites :
Before running this project, ensure you have the following installed on your machine:
Node.js (v14.x or later recommended)
npm (comes with Node.js)

Installation :
1. Clone the repository:
git clone https://github.com/tylahart/IntroToSWEProject/tree/eco-track-update
2. Install dependencies:
npm install
npm install bcrypt@^5.1.1
npm install bcryptjs@^2.4.3
npm install cors@^2.8.5
npm install dotenv@^16.4.5
npm install express@^4.21.1
npm install express-flash@^0.0.2
npm install express-session@^1.18.1
npm install method-override@^3.0.0
npm install mongoose@^8.7.3
npm install passport@^0.7.0
npm install passport-local@^1.0.0
npm install passport-local-mongoose@^8.0.0
npm install recharts@^2.13.3


Environment Variables :
1. Create a .env file in the root directory and include the following environment variables:
MONGO_URI=mongodb+srv://ecoTrack-team:introToSwe@ecotrack-db.eagnz.mongodb.net/;
SESSION_SECRET= Swe123
JWT_SECRET=fc838d8ea71980fcf16229c1d99854cc7c6f529d01fed625367027ae7870e4a00e7a45d83325213a7843170aa4a115ec7c4cf6afed03e7f2663e29ccc62b8940
REFRESH_TOKEN_SECRET=275e2654757c4123ca249dffa2eeb1012684042cd7968acf5cec6155cff1684a0a77aad2528198abd29196916c4833640f7b5410e064ded262377d7585b78613

To run code:
1. open one terminal, cd server and run "node index.js"
2. open another terminal, cd client and run "npm start"
