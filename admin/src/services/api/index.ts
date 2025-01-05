import authController from './auth/index'
import routeController from './route/index'
import contentManagementController from './content_management'
// import userController from './user'

export const API = {
  // user: userController,
  auth: authController,
  route: routeController,
  contentManagement: contentManagementController
}
