// Imports
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Declare Important Variables
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = (process.env.NODE_ENV || 'production').toLowerCase();
const PORT = process.env.PORT || 3000;

/**
 * Setup Express Server
 */
const app = express();

/**
 * Configure Express middleware
 */
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src', 'views'));

/**
 * Global template variables middleware
 *
 * Makes common variables available to all EJS templates without having to pass
 * them individually from each route handler
 */
app.use((req, res, next) => {
  // Make NODE_ENV available to all templates
  res.locals.NODE_ENV = NODE_ENV || 'production';
  // Continue to the next middleware or route handler
  next();
});

/**
 * Declare Routes
 */
app.get('/', (req, res) => {
  const title = 'Welcome Home';
  res.render('home', { title, page: 'home' });
});

app.get('/about', (req, res) => {
  const title = 'About Me';
  res.render('about', { title, page: 'about' });
});

app.get('/products', (req, res) => {
  const title = 'Our Products';
  res.render('products', { title, page: 'products' });
});

/**
 * Development: WebSocket server for live reloading
 * (Start this BEFORE the HTTP server so it's ready when the app starts)
 */
if (NODE_ENV.includes('dev')) {
  const ws = await import('ws');

  try {
    const wsPort = parseInt(PORT, 10) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on('listening', () => {
      console.log(`🔄 WebSocket server is running on ws://127.0.0.1:${wsPort}`);
    });

    wsServer.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });
  } catch (error) {
    console.error('Failed to start WebSocket server:', error);
  }
}

/**
 * Start the server and listen on the specified port
 */
app.listen(PORT, () => {
  console.log(`✅ ${NODE_ENV.toUpperCase()} | Server is running at http://127.0.0.1:${PORT}`);
});
