CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

SELECT * FROM organization;

-- Crear la tabla service_project
CREATE TABLE public.service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES public.organization(organization_id)
        ON DELETE CASCADE
);

-- Insertar 15 proyectos de prueba (5 por organización)
INSERT INTO public.service_project (organization_id, title, description, location, project_date)
VALUES 
-- Proyectos para BrightFuture Builders (ID 1)
(1, 'Community Center Renovation', 'Repairing the roof and painting walls.', 'Downtown Center', '2026-10-15'),
(1, 'Playground Build', 'Constructing a safe playground for kids.', 'Central Park', '2026-10-22'),
(1, 'Homeless Shelter Expansion', 'Adding 20 new beds and a dining area.', 'East Side Shelter', '2026-11-05'),
(1, 'Library Restoration', 'Fixing the plumbing and upgrading lights.', 'City Library', '2026-11-12'),
(1, 'School Paint Job', 'Painting classrooms before the new term.', 'Ancon Elementary', '2026-11-20'),

-- Proyectos para GreenHarvest Growers (ID 2)
(2, 'Community Garden Planting', 'Planting winter vegetables in the shared garden.', 'North Community Garden', '2026-10-10'),
(2, 'Urban Orchard Pruning', 'Trimming fruit trees for the winter.', 'Westside Orchard', '2026-10-18'),
(2, 'Composting Workshop', 'Teaching locals how to build compost bins.', 'Town Hall', '2026-10-25'),
(2, 'Farmers Market Setup', 'Building new stalls for the weekend market.', 'Market Square', '2026-11-01'),
(2, 'Seed Distribution Drive', 'Packaging and handing out seeds to families.', 'GreenHarvest HQ', '2026-11-08'),

-- Proyectos para UnityServe Volunteers (ID 3)
(3, 'Beach Cleanup', 'Removing plastic and debris from the shoreline.', 'Main Beach', '2026-10-12'),
(3, 'Food Bank Sorting', 'Organizing canned goods for distribution.', 'Unity Food Bank', '2026-10-19'),
(3, 'Senior Center Social', 'Hosting a game night for the elderly.', 'Silver Years Home', '2026-10-26'),
(3, 'Winter Coat Drive', 'Collecting and sorting warm coats.', 'UnityServe Hub', '2026-11-02'),
(3, 'Park Trail Maintenance', 'Clearing overgrown branches on walking paths.', 'Valley Trail', '2026-11-09');

-- Creating the table
CREATE TABLE public.category (
	category_id SERIAL PRIMARY KEY,
	category_name VARCHAR(100) NOT NULL
);

-- Creating the intermediate table
CREATE TABLE public.project_category (
	project_id INTEGER NOT NULL,
	category_id INTEGER NOT NULL,
	CONSTRAINT fk_service_project
		FOREIGN KEY (project_id)
		REFERENCES public.service_project(project_id)
		ON DELETE CASCADE,
	CONSTRAINT fk_category
		FOREIGN KEY (category_id)
		REFERENCES public.category(category_id)
		ON DELETE CASCADE,
	PRIMARY KEY (project_id, category_id)
);

-- Inserting categories 
INSERT INTO public.category (category_name) VALUES
('Education & Mentorship'),
('Environmental & Cleanup'),
('Community Building & Infrastructure'),
('Health & Support Services=');

-- Associating projects with categories
INSERT INTO public.project_category (project_id, category_id) VALUES
(1, 3),  -- Community Center Renovation -> Community Building
(2, 3),  -- Playground Build -> Community Building
(5, 1),  -- School Paint Job -> Education
(6, 2),  -- Community Garden Planting -> Environmental
(8, 1),  -- Composting Workshop -> Education
(11, 2), -- Beach Cleanup -> Environmental
(12, 4), -- Food Bank Sorting -> Health & Support
(13, 4); -- Senior Center Social -> Health & Support