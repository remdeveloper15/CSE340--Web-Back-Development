//Import
import { getUpcomingProjects, getProjectDetails } from '../models/project.js';
import { getCategoriesByProjectId } from '../models/categories.js';

//Variable
const NUMBER_OF_UPCOMING_PROJECTS = 5

//Functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    
    const categories = await getCategoriesByProjectId(projectId);
    
    const title = 'Project Details';

    res.render('project', { title, project, categories });
};

//Export
export { showProjectsPage, showProjectDetailsPage};
