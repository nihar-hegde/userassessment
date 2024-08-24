import { Request, Response } from "express";
import {
  deleteUserById,
  getAllUsers,
  getUserByEmail,
  getUserById,
  registerUser,
  updateUserById,
  UserModel,
} from "../db/user";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  console.log("JWT SECRET NOT FOUND");
}

export const register = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // check if email is already taken:
    const existingUser = await getUserByEmail(data.email);

    if (existingUser) {
      return res.status(400).json({
        message: "Email already taken!",
      });
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);

    const userData = { ...data, password: hashedPassword };

    const newUser = await registerUser(userData);

    if (newUser) {
      return res.status(201).json({
        message: "User Registered Successfully!",
        data: newUser,
      });
    } else {
      return res.status(500).json({
        message: "Error Registering User!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const user = await getUserByEmail(data.email);

    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const isPsswordValid = await bcryptjs.compare(data.password, user.password);

    if (!isPsswordValid) {
      return res.status(401).json({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).send({
      id: user.id,
      email: user.email,
      name: user.name,
      message: "Login successful!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out successfully" });
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    if (users) {
      return res.status(200).json({
        message: "All users retrieved successfully!",
        data: users,
      });
    } else {
      return res.status(500).json({
        message: "Error retrieving users!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const user = await getUserById(id);

    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const updatedUser = await updateUserById(id, data);

    if (updatedUser) {
      return res.status(200).json({
        message: "User updated successfully!",
        data: updatedUser,
      });
    } else {
      return res.status(500).json({
        message: "Error updating user!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const user = await getUserById(id);

    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const deletedUser = await deleteUserById(id);

    if (deletedUser) {
      return res.status(200).json({
        message: "User deleted successfully!",
        data: deletedUser,
      });
    } else {
      return res.status(500).json({
        message: "Error deleting user!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
};

export const isLoggedIn = (req: Request, res: Response) => {
  try {
    const user = req.indentity;
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};
