import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = ({ theme, handleThemeToggle }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [selectedFile, setSelectedFile] = useState(null); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem("customer"));
      if (storedUser) {
        try {
          const response = await axios.get(`http://localhost:8080/api/customers/${storedUser.id}`, {
            auth: {
              username: 'user', 
              password: 'password' 
            }
          });
          setUser(response.data);
          setEditedUser(response.data);
    
          const picResponse = await axios.get(`http://localhost:8080/api/customers/${storedUser.id}/profile-picture`, {
            auth: {
              username: 'user', 
              password: 'password' 
            }
          });
          if (picResponse.data && picResponse.data !== "null") {
            setProfilePicture(`http://localhost:8080${picResponse.data}`);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        navigate("/");
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/customers/${user.id}`, editedUser, {
        auth: {
          username: 'user', 
          password: 'password' 
        }
      });
      setUser(editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setSelectedFile(file); 
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(
        `http://localhost:8080/api/customers/${user.id}/upload-profile-picture`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          auth: {
            username: 'user', 
            password: 'password' 
          }
        }
      );
      setProfilePicture(`http://localhost:8080${response.data}`);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/customers/${user.id}/remove-profile-picture`, {
        auth: {
          username: 'user', 
          password: 'password' 
        }
      });
      setProfilePicture(null);
      setSelectedFile(null); 
      setUser((prevUser) => ({ ...prevUser, profilePictureUrl: null }));
    } catch (error) {
      console.error("Error removing profile picture:", error);
    }
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      <main className="dashboard-content">
        <div className="dashboard-box">
          <h2>Welcome, {user ? user.name : "User"}!</h2>

          <div className="profile-picture-section">
            {profilePicture ? (
              <>
                <img src={profilePicture} alt="Profile" className="profile-picture" />
                <div className="profile-buttons-container">
                  <button onClick={handleRemoveProfilePicture} className="remove-pic-btn">
                    Remove Picture
                  </button>
                  <div className="file-upload-container">
                    <label htmlFor="profile-picture-upload" className="upload-btn">
                      Change Picture
                    </label>
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      style={{ display: "none" }} 
                    />
                    <span className="file-name">
                      {selectedFile ? selectedFile.name : ""}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p>No profile picture uploaded</p>
                <div className="profile-buttons-container">
                  <div className="file-upload-container">
                    <label htmlFor="profile-picture-upload" className="upload-btn">
                      Add Picture
                    </label>
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      style={{ display: "none" }} 
                    />
                    <span className="file-name">
                      {selectedFile ? selectedFile.name : ""}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {user && (
            <div className="user-details">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Address:</strong> {user.address || "Not provided"}
              </p>
            </div>
          )}

          <button onClick={handleEdit} className="edit-profile-btn">
            Edit Profile
          </button>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Tour Management System | All Rights Reserved</p>
      </footer>

      {isEditing && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Profile</h3>
            <input
              type="text"
              placeholder="Name"
              value={editedUser.name}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Email"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              value={editedUser.phone}
              onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              value={editedUser.address || ""}
              onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;