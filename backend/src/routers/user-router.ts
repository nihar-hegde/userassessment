import express from "express";
import {
  deleteUser,
  getUsers,
  login,
  logout,
  register,
  updateUser,
} from "../controller/usercontroller";
import { isAuthenticated } from "../middleware";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/register", register);
userRouter.get("/logout", isAuthenticated, logout);
userRouter.put("/update/:id", isAuthenticated, updateUser);
userRouter.delete("/delete/:id", isAuthenticated, deleteUser);
userRouter.get("/all", isAuthenticated, getUsers);

export default userRouter;
