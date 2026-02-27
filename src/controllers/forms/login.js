import { body, validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { Router } from 'express';

const router = Router();

/**
 * Validation rules for login form
 */
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password is required')
];

/**
 * Display the login form.
 */
const showLoginForm = (req, res) => {
    res.render('forms/login/form', {
        title: 'User Login'
    });
};

/**
 * Process login form submission.
 * Uses flash messages for:
 * - validation errors
 * - user not found
 * - invalid password
 * - successful login (personalized)
 * - unexpected errors
 */
const processLogin = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Flash each validation error and redirect back to /login
        errors.array().forEach(err => {
            req.flash('error', err.msg);
        });
        return res.redirect('/login');
    }

    // Extract validated data
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        // If no user, flash generic error (avoid leaking which field failed)
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Verify password
        const passwordVerification = await verifyPassword(password, user.password);
        if (!passwordVerification) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // SECURITY: Remove password from user object before storing in session
        delete user.password;

        // Persist session
        req.session.user = user;

        // Personalized welcome message
        req.flash('success', `Welcome back, ${user.name}!`);

        // Redirect to dashboard (manteniendo tu flujo actual)
        return res.redirect('/dashboard');

    } catch (error) {
        console.error('Error logging in:', error);
        req.flash('error', 'We could not sign you in at this time. Please try again later.');
        return res.redirect('/login');
    }
};

/**
 * Handle user logout.
 * 
 * NOTE: connect.sid is the default session cookie name since we did not
 * specify a custom name when creating the session in server.js.
 */
const processLogout = (req, res) => {
    // First, check if there is a session object on the request
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.clearCookie('connect.sid');
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        req.flash('success', 'You have been logged out successfully.');
        res.redirect('/');
    });
};

/**
 * Display protected dashboard (requires login).
 */
const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    // Security check! Ensure user and sessionData do not contain password field
    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }
    if (sessionData.user && sessionData.user.password) {
        console.error('Security error: password found in sessionData.user');
        delete sessionData.user.password;
    }

    res.render('dashboard', {
        user,
        sessionData,
        title: 'Dashboard'
    });
};

// Routes
router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

// Export router as default, and specific functions for root-level routes
export default router;
export { processLogout, showDashboard };