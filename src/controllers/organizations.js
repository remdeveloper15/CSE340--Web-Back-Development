//---------------------------------------------------------------IMPORTS----------------------------------------------------------------//

//import for 
import { 
    getAllOrganizations, 
    getOrganizationDetails, 
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

//imort for project model
import { getProjectsByOrganizationId } from '../models/project.js';

//import for validation
import { body, validationResult } from 'express-validator';

//---------------------------------------------------------------MIDDLEWARES----------------------------------------------------------------//

//Middeware to validate and sanitize the organization form data
const organizationValidation = [
    body('name')
        //Trim whitespace from the beginning and end of the name
        .trim()
        .notEmpty()
        //Check if the name is not empty
        .withMessage('Organization name is required.')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters.'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required.')
        .isLength({ max: 500 })
        .withMessage('Organization description must be no more than 500 characters.'),

    body('contactEmail')
        //Pass the email through a normalization process to ensure consistency
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required.')
        .isEmail()
        .withMessage('Please provide a valid email address.')
];

//---------------------------------------------------------------FUNCTIONS----------------------------------------------------------------//

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', {title, organizationDetails, projects});
};

//Function to edit an organization
const showEditOrganizationPage = async (req, res) => {
    //Extract the organization ID from the request parameters
    const organizationId = req.params.id;

    //Retrieve the organization details from the database using the provided ID
    const organizationDetails = await getOrganizationDetails(organizationId);

    //Render the edit organization page with the retrieved details
    const title = 'Edit Organization';
    res.render('edit-organization', { title, organizationDetails });
};

const ShowNewOrganizationPage = async (req, res) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title });
};

//
const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    
    // 1. Validate the form data using express-validator
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        //If there are validation errors, redirect back to the edit organization page with the same ID
        return res.redirect(`/edit-organization/${organizationId}`);
    }

    // 2. If there are no errors, extract the new data
    const { name, description, contactEmail, logoFilename } = req.body;

    // 3. Update the database
    await updateOrganization(organizationId, name, description, contactEmail, logoFilename);
    
    // 4. Success message and redirection
    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${organizationId}`);
};

// Process the new organization form submission
const processNewOrganizationForm = async (req, res) => {

    //Verify the validation results from the middleware
    const results = validationResult(req);

    // If the list of validation errors is not empty, there are validation errors

    if (!results.isEmpty()) {
        // Interate over the errors and save them as flash messages
        results.array().forEach(error => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form page
        return res.redirect('/new-organization');
    }

    // Extract the form data from the request body
    const { name, description, contactEmail } = req.body;

    // Use a placeholder logo filename for now
    const logoFilename = 'placeholder-logo.png';

    // Create the new organization in the database
    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

    // Save a success flash message to the session
    req.flash('success', 'Organization created successfully!');

    // Redirect to the newly created organization's details page
    res.redirect(`/organization/${organizationId}`);
};

//---------------------------------------------------------------EXPORTS----------------------------------------------------------------//

export { 
    showOrganizationsPage, showOrganizationDetailsPage, ShowNewOrganizationPage, processNewOrganizationForm, organizationValidation,
    showEditOrganizationPage,
    processEditOrganizationForm
};
