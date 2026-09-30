//Import
import { getAllProjects } from '../models/project.js';

//Functions
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

//Export
export { showProjectsPage };
