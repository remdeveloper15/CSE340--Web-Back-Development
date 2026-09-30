//Import
import db from './db.js';

//Functions
const getAllOrganizations = async () => {
    const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organization;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener las organizaciones:', error.message);
        throw error; // Re-arroja el error para que el controlador/servidor lo maneje
    }
}   

const getOrganizationDetails = async (organizationId) => {
      const query = `
      SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM organization
      WHERE organization_id = $1;
    `;

      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      // Return the first row of the result set, or null if no rows are found
      return result.rows.length > 0 ? result.rows[0] : null;
};

//Export
export { getAllOrganizations, getOrganizationDetails }