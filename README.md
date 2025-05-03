# That-Idea Backend

This is the backend repository for **That-Idea**, a platform where users can share their ideas, pitch their concepts, and engage with other users through likes and comments. Built with the **MERN stack**, this backend handles authentication, idea management, user interactions, and more.

## Tech Stack
- **Node.js** - Server-side runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database for storing user data and ideas
- **Firebase Auth** - Used for authentication (Google Login)
- **Firebase Storage** - Used for storing media (images, documents, etc.)
- **Mongoose** - ODM for MongoDB
- **Cors** - Middleware to enable cross-origin requests
- **Dotenv** - For managing environment variables

## Features
- **User Authentication**: Secure login via Firebase Google Auth.
- **Idea Posting**: Users can share their ideas with titles, descriptions, and media.
- **Like System**: Engage with other users through likes.
- **Search & Filter**: Users can search for specific ideas using keywords.
- **Idea Management**: Users can edit or delete their ideas.

## Installation & Setup

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Steps to Set Up
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/that-idea-backend.git
   cd that-idea-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a **.env** file and add the required environment variables:
   ```env
   PORT = 4000
   MONGO_URL = 
   JWT_SECRET = 

   # FIREBASE ADMIN CONFIG

   FIREBASE_TYPE=
   FIREBASE_PROJECT_ID=
   FIREBASE_PRIVATE_KEY_ID=
   FIREBASE_PRIVATE_KEY=
   FIREBASE_CLIENT_EMAIL=
   FIREBASE_CLIENT_ID=
   FIREBASE_AUTH_URI=
   FIREBASE_TOKEN_URI=
   FIREBASE_AUTH_PROVIDER_CERT_URL=
   FIREBASE_CLIENT_CERT_URL=
   FIREBASE_UNIVERSE_DOMAIN=
   FIREBASE_STORAGE_BUCKET =

   NODE_ENV = development

   FRONTEND_URL= 
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- **POST /api/v1/users/signup** - User login using Firebase
- **GET /api/v1/users/logout** - User logout
- **GET /api/v1/users/checkAuth** - User Check Auth

### Ideas
- **POST /api/v1/ideas/addIdea** - Create a new idea
- **GET /api/v1/ideas/getIdeas** - Get all ideas
- **GET /api/v1/ideas/getIdea/:id** - Get a specific idea
- **DELETE /api/v1/ideas/deleteIdea/:id** - Delete an idea
- **GET /api/v1/ideas/getUserIdeas** - Get logged in User Ideas
- **GET /api/v1/ideas/searchIdea?query=** - Search Ideas
- **GET /api/v1/ideas/getViewUser/:id** - Get a User
- **PUT /api/v1/ideas/toggleIdeaLike/:id** - Toggle Like

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Added a new feature"`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any queries or suggestions, feel free to reach out:
- **Developer**: Harshit Parmar
- **Email**: parmarharshit441@gmail.com
- **LinkedIn**: [Profile](https://www.linkedin.com/in/harshit-parmar-47253b282)

