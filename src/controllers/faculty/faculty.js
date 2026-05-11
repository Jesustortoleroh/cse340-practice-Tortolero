import {getFacultyById, getSortedFaculty} from '../../models/faculty/faculty.js';


// Faculty list
const facultyListPage = (req, res) => {
  const sortBy = req.query.sort || 'name';

  const facultyList = getSortedFaculty(sortBy);

  res.render('faculty/list', {
    title: 'Faculty Directory',
    faculty: facultyList,
    currentSort: sortBy
  });
};

// Faculty detail
const facultyDetailPage = (req, res, next) => {
  const facultyId = req.params.facultyId;

  const person = getFacultyById(facultyId);

  if (!person) {
    const err = new Error('Faculty not found');
    err.status = 404;
    return next(err);
  }

  res.render('faculty/detail', {
    title: person.name,
    faculty: person
  });
};

export { facultyListPage, facultyDetailPage };
