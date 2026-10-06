//---------------------------------------------------------------IMPORTS----------------------------------------------------------------//

import express from 'express'

import {
    showHomePage
} from './controllers/index.js';

import {
    showProjectsPage, 
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';

import {
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryPage,
    processNewCategoryForm,
    showEditCategoryPage,
    processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';

import {
    testErrorPage
} from './controllers/errors.js';

import { 
    showOrganizationsPage,
    showOrganizationDetailsPage, ShowNewOrganizationPage, processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationPage,
    processEditOrganizationForm
} from './controllers/organizations.js';

import { 
    showUserRegistrationForm, 
    processUserRegistrationForm
} from './controllers/users.js';

//---------------------------------------------------------------ROUTES----------------------------------------------------------------//

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

router.get('/test-error', testErrorPage);

router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage)

router.get('/new-organization', ShowNewOrganizationPage);

// Process the new organization form submission with validation middleware
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to show the edit organization page
router.get('/edit-organization/:id', showEditOrganizationPage);

// Route to process the edit organization form submission with validation middleware
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

//Routes for showing the new project form and processing the form submission
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);

//Routes for assigning categories to a project
router.get('/assign-categories/:projectId', showAssignCategoriesForm);

// Routes for creating categories
router.get('/new-category', showNewCategoryPage);

router.post('/new-category', categoryValidation, processNewCategoryForm);

// Routes for editing categories
router.get('/edit-category/:id', showEditCategoryPage);

router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

router.post('/assign-categories/:projectId', processAssignCategoriesForm);

//Routes for editing a project
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

//Routes for new users
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

//---------------------------------------------------------------EXPORTS----------------------------------------------------------------//

export default router;