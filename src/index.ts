import express from 'express';
import 'dotenv/config';
import session from 'express-session';
import path from 'path';
import { loadUserPermissions } from './middleware/rbacMiddleware';

import authRoutes       from './routers/authRoutes';
import userRoutes       from './routers/userRoutes';
import roleRoutes       from './routers/roleRoutes';
import permissionRoutes from './routers/permissionRoutes';

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 jam
}));

// Load permissions ke setiap request
app.use(loadUserPermissions);

// Routes
app.get('/', (req, res) => res.redirect('/users'));
app.use('/auth',        authRoutes);
app.use('/users',       userRoutes);
app.use('/roles',       roleRoutes);
app.use('/permissions', permissionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
