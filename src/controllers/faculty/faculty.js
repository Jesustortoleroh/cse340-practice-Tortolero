import { getAllFaculty, getFacultyById } from '../../models/faculty/faculty.js';

// Route handler for the faculty list page
const facultyListPage = (req, res) => {
    const faculty = getAllFaculty();

    res.render('faculty', {
        title: 'Faculty',
        faculty: faculty
    });
};

// Route handler for individual faculty detail pages
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const member = getFacultyById(facultyId);

    // If faculty member doesn't exist, create 404 error
    if (!member) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty-detail', {
        title: `${member.name}`,
        faculty: member
    });
};

export { facultyListPage, facultyDetailPage };