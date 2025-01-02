import router from '@adonisjs/core/services/router';
import AuthRoutes from './aut.js';

router.group(() => {
  AuthRoutes();
}).prefix('/api').as('api');
