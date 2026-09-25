import db from './db.js';

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

export { getAllOrganizations };