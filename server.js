//---------------------------------------------------------------IMPORTS----------------------------------------------------------------//

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection} from './src/models/db.js'; 
import router from './src/routes.js';
import session from 'express-session';
import flash from './src/middleware/flash.js';

//---------------------------------------------------------------CONFIG----------------------------------------------------------------//

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

//Recreate __dirname and __filename in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Initialize the Express application
const app = express();

//--------------------------------------------------------------MIDDLEWARE----------------------------------------------------------------//

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

//Middleware to log all incoming requests
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  //Pass control to the next middleware function
  next();
});

// Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Middleware to handle sessions
const SESSION_SECRET = process.env.SESSION_SECRET;

//Inializate the session
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}));

// Middleware to make flash messages available to all templates
app.use(flash);

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
  res.locals.isLoggedIn = false;

    // If a user exists in the session, change the value to true
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
    }

    res.locals.NODE_ENV = NODE_ENV;
    next();
});

//--------------------------------------------------------------ROUTES----------------------------------------------------------------//

app.use(router);

//-----------------------------------------------------------ERROR HANDLING----------------------------------------------------------------//

//Catch-all route for handling 404 errors
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

//Global Error Handler
app.use((err, req, res, next) => {
  //Log error details for debugging
  console.error('Error occurred:', err.message);
  console.error('Stack trace:', err.stack);
  //Determine status and template
  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';
  //Prepare data for the template
  const context = {
    title: status === 404 ? 'Page Not Found' : 'Internal Server Error',
    error: err.message,
    stack: err.stack
  };
  //Render the appropriate error template
  res.status(status).render(`errors/${template}`, context);
});

//-----------------------------------------------------------START SERVER----------------------------------------------------------------//

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});