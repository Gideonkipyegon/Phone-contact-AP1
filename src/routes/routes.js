import {
  allUsers,
  allGroups,
  createUser,
  getSingleUser,
  updateUser,
  assignGroup,
  deleteUser,
} from "../controllers/phoneContoller.js";
import { login, register, loginRequired} from '../controllers/userController.js';

const user = (app) => {
  app.route("/users").get(loginRequired, allUsers).post(loginRequired, createUser);
  app.route("/groups").get(allGroups);

  app.route("/users/:id").get(loginRequired, getSingleUser).put(loginRequired, updateUser).delete(loginRequired, deleteUser);
  app.route("/groups/:id").put(assignGroup);

  app.route('/auth/register')
     .post(register);

  app.route('/auth/login')
     .post(login)
};
export default user;
