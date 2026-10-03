//---------------------------------------------------------------IMPORTS----------------------------------------------------------------//

import { 
    getUpcomingProjects, 
    getProjectDetails,
    createProject,
    updateProject,
 } from '../models/project.js';


import { 
    getAllOrganizations 
} from '../models/organizations.js';

import { 
    getCategoriesByProjectId 
} from '../models/categories.js';

import { 
    body, validationResult 
} from 'express-validator';

//---------------------------------------------------------------CONSTANTS----------------------------------------------------------------//

const NUMBER_OF_UPCOMING_PROJECTS = 5

//---------------------------------------------------------------FUNCTIONS----------------------------------------------------------------//

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    
    const categories = await getCategoriesByProjectId(projectId);
    
    const title = 'Project Details';

    res.render('project', { title, project, categories });
};

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required.')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters.'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required.')
        .isLength({ max: 1000 })
        .withMessage('Project description must be no more than 1000 characters.'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required.')
        .isLength({ max: 200 }) 
        .withMessage('Project location must be no more than 200 characters.'),
    body('projectDate')
        .notEmpty()
        .withMessage('Project date is required.')
        .isISO8601()
        .withMessage('Please provide a valid date.'),
    body('organizationId')
        .notEmpty()
        .withMessage('Organization ID is required.')
        .isInt()
        .withMessage('Organization ID must be a valid integer.'),
];

//function to display the form for creating a new project
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

//function to process the form submission for creating a new project
const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-project');
    }

    //Extract the form data from the request body
    const { title, description, location, projectDate, organizationId } = req.body;

    try {

        //Create the new project in the database
        const newProjectId = await createProject(title, description, location, projectDate, organizationId);
        req.flash('success', 'New service project created successfully.');
        res.redirect(`/projects`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'An error occurred while creating the project. Please try again.');
        res.redirect('/new-project');
    }
};

//function to display the form for editing an existing project
const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    
    // Format the project date to 'YYYY-MM-DD' for the input field
    const formattedDate = new Date(project.date).toISOString().split('T')[0];

    const title = 'Edit Service Project';
    res.render('edit-project', { title, project, organizations, formattedDate });
};

//function to process the form submission for editing an existing project
const processEditProjectForm = async (req, res) => {
    const errors = validationResult(req);
    const projectId = req.params.id;

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, projectDate, organizationId } = req.body;

    try {
        await updateProject(projectId, title, description, location, projectDate, organizationId);
        req.flash('success', 'Project updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'An error occurred while updating the project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

//---------------------------------------------------------------EXPORTS----------------------------------------------------------------//

export { 
    showProjectsPage, 
    showNewProjectForm,
    processNewProjectForm,
    showProjectDetailsPage,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};
