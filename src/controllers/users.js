//---------------------------------------------------------------IMPORTS----------------------------------------------------------------//

import bcrypt from 'bcrypt';
import { 
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';

//---------------------------------------------------------------FUNCTIONS----------------------------------------------------------------//

//Function to Show User Registration Form
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

//Function to Process the Registration Form
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Genera la "sal" y el hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Guarda el usuario con el hash, no con la contraseña real
        const userId = await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

//Function to Show the Empty Login Form
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

//Function to Process the Login Form
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        
        if (user) {

            // Save the login user data in its browser
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

//Function to Porcess the Logout Session
const processLogout = async (req, res) => {
    if (req.session.user) {

        // Delete user data from the browser
        delete req.session.user; 
        
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

// Function to show the Dashboard
const showDashboard = (req, res) => {

    //We get data from the memory
    const user = req.session.user; 
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

// Function to show the Users list page (Admin only)
const showUsersPage = async (req, res) => {
    try {
        const usersList = await getAllUsers();
        res.render('users', { 
            title: 'Registered Users',
            usersList: usersList
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error', 'Could not load the users list.');
        res.redirect('/dashboard');
    }
};

//---------------------------------------------------------------MIDDLEWARES----------------------------------------------------------------//

// Middleware to protect routes
const requireLogin = (req, res, next) => {

    // If there is no open session, it come back to the login page
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    // If is logged, pass
    next();
};

//Middleware to authorization
const requireRole = (role) => {
    return (req, res, next) => {

        // Check if it is loged
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check the role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // Pass
        next();
    };
};

//---------------------------------------------------------------EXPORTS----------------------------------------------------------------//

export { 
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
};