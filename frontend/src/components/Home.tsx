// components/Home.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Provider/AuthProvider";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/all",
        { withCredentials: true }
      );
      const data = await response.data;
      console.log("All users data", data);
      setUsers(data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/user/delete/${userId}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await axios.put(
        `http://localhost:8080/api/v1/user/update/${editingUser._id}`,
        editingUser,
        {
          withCredentials: true,
        }
      );
      setUsers(
        users.map((user) => (user._id === editingUser._id ? editingUser : user))
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Registered Users</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {editingUser ? (
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              className="form-control"
              id="phone"
              value={editingUser.phone}
              onChange={(e) =>
                setEditingUser({ ...editingUser, phone: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="profession" className="form-label">
              Profession
            </label>
            <input
              type="text"
              className="form-control"
              id="profession"
              value={editingUser.profession}
              onChange={(e) =>
                setEditingUser({ ...editingUser, profession: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="btn btn-primary me-2">
            Update
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditingUser(null)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="row g-4">
          {users.map((user) => (
            <div key={user._id} className="col-md-6 col-lg-4 mb-4">
              <div
                className="card h-100 shadow-sm"
                style={{
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  border: "1px solid #e0e0e0",
                }}
              >
                <div className="card-body d-flex flex-column p-4">
                  <h5
                    className="card-title mb-3"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {user.name}
                  </h5>
                  <p
                    className="card-text mb-2"
                    style={{ fontSize: "0.9rem", color: "#555" }}
                  >
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p
                    className="card-text mb-2"
                    style={{ fontSize: "0.9rem", color: "#555" }}
                  >
                    <strong>Profession:</strong> {user.profession}
                  </p>
                  <p
                    className="card-text mb-3"
                    style={{ fontSize: "0.9rem", color: "#555" }}
                  >
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <div className="mt-auto pt-3 d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleEdit(user)}
                      style={{ width: "48%", borderRadius: "4px" }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(user._id)}
                      style={{ width: "48%", borderRadius: "4px" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
