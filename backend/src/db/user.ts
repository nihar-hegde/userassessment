import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, required: true },
  profession: { type: String, required: true },
});

export const UserModel = mongoose.model("User", UserSchema);

export const registerUser = (value: Record<string, any>) =>
  UserModel.create(value);

//NOTE: get a user by their email:

export const getUserByEmail = (email: string) =>
  UserModel.findOne({ email }).select("+password");

//NOTE: get a user by their id:
export const getUserById = (id: string) => UserModel.findById(id);

//NOTE: Get a user by their username:
export const getUserByUsername = (username: string) =>
  UserModel.findOne({ username });

//NOTE: Delete a user by their id:
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });

//NOTE: Update a user by their id:
export const updateUserById = (id: string, value: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, value);

export const getAllUsers = () => UserModel.find();
