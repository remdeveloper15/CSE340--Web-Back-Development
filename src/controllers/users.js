//---------------------------------------------------------------IMPORTS----------------------------------------------------------------//

import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';

//---------------------------------------------------------------FUNCTIONS----------------------------------------------------------------//

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

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

//---------------------------------------------------------------EXPORTS----------------------------------------------------------------//

export { showUserRegistrationForm, processUserRegistrationForm };