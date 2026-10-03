//---------------------------------------------------------------IMPORTS----------------------------------------------------------------//

import {getProjectDetails} from '../models/project.js';

import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignment,
    createCategory,
    updateCategory,
} from '../models/categories.js';

import { 
    body, 
    validationResult 
} from 'express-validator';
//---------------------------------------------------------------FUNCTIONS----------------------------------------------------------------//

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    
    res.render('categories', { title, categories });
};


const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';

    res.render('category', { title, category, projects });
};

//function to display new category page
const showNewCategoryPage = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title });
};

//function to process New Category Form
const processNewCategoryForm = async (req, res) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    const { categoryName } = req.body;

    const categoryId = await createCategory(categoryName);

    req.flash('success', 'Category created successfully!');

    res.redirect(`/category/${categoryId}`);
};

const showEditCategoryPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    const title = 'Edit Category';

    res.render('edit-category', { title, category });
};

const processEditCategoryForm = async (req, res) => {

    const categoryId = req.params.id;

    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { categoryName } = req.body;

    await updateCategory(categoryId, categoryName);

    req.flash('success', 'Category updated successfully!');

    res.redirect(`/category/${categoryId}`);
};


//function to create a new category
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = `Assign Categories to Project`;

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

//function to process the form submission for assigning categories to a project
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

    await updateCategoryAssignment(projectId, categoryIdsArray);

    req.flash('success', 'Categories assigned successfully.');
    res.redirect(`/project/${projectId}`);
};



//---------------------------------------------------------------MIDDLEWARES----------------------------------------------------------------//

// Middleware to validate and sanitize category form data
const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty()
        .withMessage('Category name is required.')
        .isLength({ max: 100 })
        .withMessage('Category name must be no more than 100 characters.')
        .isLength({ min: 3 })
        .withMessage('Category name must be at least 3 characters.')
];


//---------------------------------------------------------------EXPORTS----------------------------------------------------------------//

export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryPage,
    processNewCategoryForm,
    showEditCategoryPage,
    processEditCategoryForm,
    categoryValidation
};

