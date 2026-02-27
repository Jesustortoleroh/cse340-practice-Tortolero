import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

const router = Router();

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

/**
 * Display the registration form page.
 */
const showRegistrationForm = (req, res) => {
  res.render('forms/registration/form', {
    title: 'User Registration',
  });
};

/**
 * Handle user registration with validation and password hashing.
 * Uses flash messages for validation, duplicate email, success, and unexpected errors.
 */
const processRegistration = async (req, res) => {
  const errors = validationResult(req);

  // Inside your validation error check
if (!errors.isEmpty()) {
    // Store each validation error as a separate flash message
    errors.array().forEach(error => {
        req.flash('error', error.msg);
    });
    return res.redirect('/register');
}
  // Extract validated data
  const { name, email, password } = req.body;

  try {
    // Check for duplicate email before hashing password
    const exists = await emailExists(email);
    if (exists) {
      req.flash('warning', 'An account with that email already exists. Please sign in or use a different email.');
      return res.redirect('/register');
    }

    // Hash the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    await saveUser(name, email, hashedPassword);

    // Successful registration
    req.flash('success', 'Registration successful! You can now sign in.');
    return res.redirect('/login');

  } catch (error) {
    // Unexpected error handling
    console.error('[register] Error processing registration:', error);
    req.flash('error', 'Unable to complete your registration. Please try again later.');
    return res.redirect('/register');
  }
};

/**
 * Display all registered users.
 */
const showAllUsers = async (req, res) => {
  let users = [];
  try {
    users = await getAllUsers();
  } catch (error) {
    console.error('[register] Error fetching users:', error);
    // Optional user-facing feedback for this page:
    req.flash('error', 'Unable to load users right now.');
  }

  res.render('forms/registration/list', {
    title: 'Registered Users',
    users,
  });
};

/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);

/**
 * GET /register/list - Display all registered users
 */
router.get('/list', showAllUsers);

export default router;