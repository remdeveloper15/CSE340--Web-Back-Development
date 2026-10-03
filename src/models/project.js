//---------------------------------------------------------------IMPORTS----------------------------------------------------------------//

import db from './db.js';

//---------------------------------------------------------------FUNCTIONS----------------------------------------------------------------//
//funciton to get all projects
const getAllProjects = async () => {
    const query = `
        SELECT 
            sp.project_id, 
            sp.title, 
            sp.description, 
            sp.location, 
            sp.project_date, 
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o ON sp.organization_id = o.organization_id;
    `;
    
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects:', error.message);
        throw error;
    }
};

//function to get projects by organization id
const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY project_date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

//function to get upcoming projects
const getUpcomingProjects = async (numberOfProjects) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.project_date AS date, p.location, p.organization_id, o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;
    const result = await db.query(query, [numberOfProjects]);
    return result.rows;
};

//function to get project details by id
const getProjectDetails = async (id) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.project_date AS date, p.location, p.organization_id, o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const result = await db.query(query, [id]);
    // Retorna el primer resultado, o null si no existe
    return result.rows.length > 0 ? result.rows[0] : null;
};

//functions to create a new project
const createProject = async (title, description, location, projectDate, organizationId) => {
    const query = `
        INSERT INTO service_project (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, projectDate, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not created');
    }
    return result.rows[0].project_id;
};

//function to update a project
const updateProject = async (id, title, description, location, projectDate, organizationId) => {
    const query = `
        UPDATE service_project
        SET title = $1, description = $2, location = $3, project_date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING *;
    `;
    const queryParams = [title, description, location, projectDate, organizationId, id];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project');
    }
    return result.rows[0];
};

//---------------------------------------------------------------EXPORTS----------------------------------------------------------------//

export { 
    getAllProjects,
    getProjectsByOrganizationId, getUpcomingProjects, 
    getProjectDetails, 
    createProject,
    updateProject
};