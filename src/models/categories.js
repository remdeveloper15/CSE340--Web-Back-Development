//Imports
import db from './db.js';

//Functions
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

//Exports
export { getAllCategories, getCategoryById, getProjectsByCategoryId, getCategoriesByProjectId };    