//Import 
import { getAllOrganizations } from '../models/organizations.js';

//Functions
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

//Export
export { showOrganizationsPage };
