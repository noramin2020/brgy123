import React, { useState, useEffect } from "react";
import axios from "axios";
import PinfoModal from "../Modal/pinfomodal";
import IinfoModal from "../Modal/iinfomodal"; // Import income info modal
import "../styles/pages.css"; // Assuming shared CSS styles for consistency
import image from "../assets/Profile.jpg";

function InfoRecordsPage() {
  const [userData, setUserData] = useState(null); // To store user data (name, etc.)
  const [pinfo, setPinfo] = useState(null);
  const [incomeInfo, setIncomeInfo] = useState(null);
  const [pinfoModalOpen, setPinfoModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false); // state for income modal
  const [loadingPinfo, setLoadingPinfo] = useState(false); // loading state for personal info
  const [loadingIncome, setLoadingIncome] = useState(false); // loading state for income info
  const [userImage, setUserImage] = useState(null);

  const account_id = localStorage.getItem("IDNumber"); // get logged-in user's ID

  useEffect(() => {
    fetchUserData();
    fetchUserPinfo();
    fetchIncomeInfo();
    fetchUserImage();
  }, [account_id]);

  // Fetch user basic data
  const fetchUserData = async () => {
    if (!account_id) {
      alert("Account ID is missing.");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/name/${account_id}`);
      if (response.data && response.data.length > 0) {
        setUserData(response.data[0]); // Assuming the response is an array, we select the first element
      } else {
        alert("No user data found.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      alert("Failed to fetch user data.");
    }
  };

  // Fetch user personal info
  const fetchUserPinfo = async () => {
    setLoadingPinfo(true);
    try {
      const response = await axios.get(`http://localhost:5000/userpinfo/${account_id}`);
      setPinfo(response.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setPinfo(null); // No data found
      } else {
        alert("Failed to fetch personal info.");
      }
    } finally {
      setLoadingPinfo(false);
    }
  };

  // Fetch income information
  const fetchIncomeInfo = async () => {
    setLoadingIncome(true);
    try {
      const response = await axios.get(`http://localhost:5000/i_info/${account_id}`);
      setIncomeInfo(response.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setIncomeInfo(null); // No data found
      } else {
        alert("Failed to fetch income info.");
      }
    } finally {
      setLoadingIncome(false);
    }
  };

  // Save personal info
  const handleSavePinfo = async (formData) => {
    try {
      const payload = { ...formData, account_id };
      const response = await axios.post("http://localhost:5000/userpinfo/add", payload);
      alert(response.data.message || "Saved successfully");
      fetchUserPinfo();
      setPinfoModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save personal info");
    }
  };

  // Save income info
  const handleSaveIncomeInfo = async (formData) => {
    try {
      const payload = { ...formData, account_id };
      const response = await axios.post("http://localhost:5000/i_info/add", payload);
      alert(response.data.message || "Saved successfully");
      fetchIncomeInfo();
      setIncomeModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save income info");
    }
  };

  const fetchUserImage = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/image/${account_id}`);
      if (response.data && response.data.img) {
        setUserImage(response.data.img); // Assuming base64 image string
      } else {
        setUserImage(null);
      }
    } catch (err) {
      console.error("Error fetching image:", err);
      setUserImage(null);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1]; // Remove the prefix

      try {
        const response = await axios.post("http://localhost:5000/image/add", {
          account_id,
          img: base64Image,
        });

        alert(response.data.message || "Image uploaded successfully");
        fetchUserImage(); // Refresh the image preview
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="info-records-container">
      <div className="top-container">
        {/* User Information Section on the Right */}
        <div className="user-info-container">
          {userData && (
            <div className="info-section">
              <h2>Logged-in User Information</h2>
              <div>
                <p><strong>Name:</strong> {`${userData.first_name} ${userData.middle_name} ${userData.last_name} ${userData.extension}`}</p>
                <p><strong>Position:</strong> {userData.Position}</p>
                <p><strong>Resident Type:</strong> {userData.ResidentType}</p>
                <p><strong>House No:</strong> {userData.HouseNo}</p>
                <p><strong>Zone No:</strong> {userData.ZoneNo}</p>
                {/* Image Upload Button */}
                <div className="upload-container">
                  <label htmlFor="imageUpload" className="upload-button">
                    {userImage ? "Change Image" : "Upload Image"}
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <img
          src={userImage ? `data:image/jpeg;base64,${userImage}` : image}
          alt="User Profile"
          className="profile-image"
        />
      </div>

      {/* Personal and Income Information Section Below */}
      <div className="info-columns">
        {/* Personal Information Section */}
        <div className="info-column">
          <h2>Your Personal Information</h2>
          <button onClick={() => setPinfoModalOpen(true)}>{pinfo ? "Update" : "Add"}</button>

          {loadingPinfo ? (
            <p>Loading...</p>
          ) : pinfo ? (
            <div>
              <p><strong>Gender:</strong> {pinfo.gender}</p>
              <p><strong>Civil Status:</strong> {pinfo.c_status}</p>
            </div>
          ) : (
            <div>
              <p><strong>Gender:</strong></p>
              <p><strong>Civil Status:</strong></p>
            </div>
          )}
        </div>

        {/* Income Information Section */}
        <div className="info-column">
          <h2>Your Income Information</h2>
          <button onClick={() => setIncomeModalOpen(true)}>{incomeInfo ? "Update" : "Add"}</button>

          {loadingIncome ? (
            <p>Loading...</p>
          ) : incomeInfo && incomeInfo.length > 0 ? (
            <div>
              {incomeInfo.map((info) => (
                <div key={info.id}>
                  <p><strong>Occupation:</strong> {info.occupation}</p>
                  <p><strong>Income:</strong> {info.fmi}</p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p><strong>Occupation:</strong></p>
              <p><strong>Income:</strong></p>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information Modal */}
      <PinfoModal
        isOpen={pinfoModalOpen}
        onClose={() => setPinfoModalOpen(false)}
        onAdd={handleSavePinfo}
        initialData={pinfo}
      />

      {/* Income Information Modal */}
      <IinfoModal
        isOpen={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        onAdd={handleSaveIncomeInfo}
        initialData={incomeInfo ? incomeInfo[0] : null}
      />
    </div>
  );
}

export default InfoRecordsPage;
