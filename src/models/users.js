//---------------------------------------------------------------IMPORTS----------------------------------------------------------------//

import db from './db.js';
import bcrypt from 'bcrypt';

//---------------------------------------------------------------FUNCTIONS----------------------------------------------------------------//

//Function to Create a New User
const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

//Function to look a user by its email
const findUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role_id 
        FROM users 
        WHERE email = $1
    `;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        
        // User not found
        return null; 
    }
    
    return result.rows[0];
};

// Function to compare password to the hash
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// Function to validate the Login session
const authenticateUser = async (email, password) => {

    // Look for the email
    const user = await findUserByEmail(email);
    if (!user) {

        // Email does not exists
        return null; 
    }

    // Compare passwords
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    
    // If everything is correct, delete the hash and it returns data
    if (isPasswordValid) {
        delete user.password_hash; 

        // Never pass the has to fronted
        return user;
    }
    
    // Password is incorrect
    return null;
};

//---------------------------------------------------------------EXPORTS----------------------------------------------------------------//

export { 
    createUser,
    authenticateUser
};