import { Express } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import postRoutes from './modules/posts/post.routes.js';
import interestRoutes from './modules/interests/interest.routes.js';
// Placeholder modules (basic implementation)
// import favoriteRoutes from './modules/favorites/favorite.routes.js';
// import mediaRoutes from './modules/media/media.routes.js';
// import notificationRoutes from './modules/notifications/notification.routes.js';

export const loadRoutes = (app: Express): void => {
  // API version prefix
  const API_PREFIX = '/api/v1';

  // Auth routes
  app.use(`${API_PREFIX}/auth`, authRoutes);

  // User routes
  app.use(`${API_PREFIX}/users`, userRoutes);

  // Post routes
  app.use(`${API_PREFIX}/posts`, postRoutes);

  // Interest routes (adoption applications)
  app.use(`${API_PREFIX}/interests`, interestRoutes);

  // Favorite routes (handled by post routes)
  // app.use(`${API_PREFIX}/favorites`, favoriteRoutes);

  // Media routes (placeholder)
  // app.use(`${API_PREFIX}/media`, mediaRoutes);

  // Notification routes (placeholder)
  // app.use(`${API_PREFIX}/notifications`, notificationRoutes);

  // Post routes (to be implemented)
  // app.use(`${API_PREFIX}/posts`, postRoutes);

  // Interest routes (to be implemented)
  // app.use(`${API_PREFIX}/interests`, interestRoutes);

  // Favorites routes (to be implemented)
  // app.use(`${API_PREFIX}/favorites`, favoriteRoutes);

  // Media routes (to be implemented)
  // app.use(`${API_PREFIX}/media`, mediaRoutes);

  // Notification routes (to be implemented)
  // app.use(`${API_PREFIX}/notifications`, notificationRoutes);
};
