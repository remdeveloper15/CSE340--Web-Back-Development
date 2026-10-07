//---------------------------------------------------------------IMPORTS----------------------------------------------------------------//

import express from 'express';

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
    showOrganizationDetailsPage, 
    ShowNewOrganizationPage, 
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationPage,
    processEditOrganizationForm
} from './controllers/organizations.js';

import { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
} from './controllers/users.js';

//---------------------------------------------------------------ROUTES----------------------------------------------------------------//

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);

router.get('/test-error', testErrorPage);

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);


// ==========================================
// PROTECTED ROUTES
// ==========================================
router.get('/dashboard', requireLogin, showDashboard);


// ==========================================
// ADMIN ROUTES
// ==========================================

// --- Organizaciones ---
router.get('/new-organization', requireRole('admin'), ShowNewOrganizationPage);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationPage);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// --- Projects + ---
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// --- Categories ---
router.get('/new-category', requireRole('admin'), showNewCategoryPage);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

router.get('/edit-category/:id', requireRole('admin'), showEditCategoryPage);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// --- Assign Categories to Projects ---
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// --- Users ---
router.get('/users', requireRole('admin'), showUsersPage);

//---------------------------------------------------------------EXPORTS----------------------------------------------------------------//

export default router;