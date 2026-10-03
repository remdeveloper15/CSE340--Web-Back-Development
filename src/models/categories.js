//---------------------------------------------------------------IMPORTS----------------------------------------------------------------//

import db from './db.js';

//---------------------------------------------------------------FUNCTIONS----------------------------------------------------------------//

const getAllCategories = async () => {
    const query = 'SELECT category_id, category_name FROM category;';
    const result = await db.query(query);
    return result.rows;
};

const getCategoryById = async (categoryId) => {
    const query = 'SELECT category_id, category_name FROM category WHERE category_id = $1;';
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title 
        FROM service_project p
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name 
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

//Function to assign a category to a project
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;
    const queryParams = [categoryId, projectId];
    await db.query(query, queryParams);
};

//Function to update category assignments for a project
const updateCategoryAssignment = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_category 
        WHERE project_id = $1;
    `;
    
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};  

// Function to create a new category
const createCategory = async (categoryName) => {
    const query = `
        INSERT INTO category (category_name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const queryParams = [categoryName];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

// Function to update an existing category
const updateCategory = async (categoryId, categoryName) => {
    const query = `
        UPDATE category
        SET category_name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const queryParams = [categoryName, categoryId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    return result.rows[0].category_id;
};

//---------------------------------------------------------------EXPORTS----------------------------------------------------------------//

export { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId, getCategoriesByProjectId, updateCategoryAssignment,
    createCategory,
    updateCategory 
};    