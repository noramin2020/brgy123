import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo.png";
import axios from "axios";

const Profile = () => {
  const [account_id, setAccountId] = useState(localStorage.getItem("IDNumber") || "");
  const [first_name, setFirstName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [last_name, setLastName] = useState("");
  const [extension, setExtension] = useState("");
  const [HouseNo, setHouseNo] = useState("");
  const [ZoneNo, setZoneNo] = useState("");
  const [purpose, setPurpose] = useState("");
  const [pinfo, setPinfo] = useState(null);
  const [iinfo, setIinfo] = useState(null);
  const [cinfo, setCinfo] = useState(null);
  const [Images, setImages] = useState([]);
  const [error, setError] = useState("");

  const fetchInfo = async () => {
    try {
      const [p, i, c, img] = await Promise.all([
        axios.get(`https://brgyback.onrender.com/pinfo/${account_id}`),
        axios.get(`https://brgyback.onrender.com/iinfo/${account_id}`),
        axios.get(`https://brgyback.onrender.com/cinfo/${account_id}`),
        axios.get(`https://brgyback.onrender.com/images/${account_id}`)
      ]);
      setPinfo(p.data);
      setIinfo(i.data);
      setCinfo(c.data);
      setImages(img.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    if (account_id.trim() !== "") {
      axios.get(`https://brgyback.onrender.com/cert/${account_id}`)
        .then((res) => {
          const user = res.data[0];
          setFirstName(user.first_name || "");
          setMiddleName(user.middle_name || "");
          setLastName(user.last_name || "");
          setExtension(user.extension || "");
          setHouseNo(user.HouseNo || "");
          setZoneNo(user.ZoneNo || "");
        })
        .catch((err) => console.error(err));
    }
  }, [account_id]);

  const handleSearch = () => {
    if (!account_id || !purpose) {
      setError("Please enter both ID number and purpose.");
      return;
    }
    setError("");
    fetchInfo();
  };

  return (
    <div className="profile-wrapper">
      <div className="input-group">
        <input
          type="number"
          placeholder="Enter ID number"
          value={account_id}
          onChange={(e) => setAccountId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
        <button onClick={handleSearch}>View Profile</button>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="container">
        <div className="profile-header">
      
          <div className="profile-title">
            <h1>User Profile</h1>
            <h2>{first_name} {middle_name} {last_name} {extension}</h2>
            <h3>ID: {account_id}</h3>
            <h4>Address: {HouseNo} {ZoneNo}</h4>
          </div>

        </div>

        {pinfo && (
          <section className="section">
            <h2>Personal Information</h2>
            <p><strong>Gender:</strong> {pinfo.gender}</p>
            <p><strong>Civil Status:</strong> {pinfo.c_status}</p>
          </section>
        )}

        {iinfo && (
          <section className="section">
            <h2>Income Information</h2>
            <p><strong>Occupation:</strong> {iinfo.occupation}</p>
            <p><strong>Family Monthly Income:</strong> {iinfo.fmi}</p>
          </section>
        )}

        {cinfo && (
          <section className="section">
            <h2>Contact Information</h2>
            <p><strong>Gmail:</strong> {cinfo.gmail}</p>
            <p><strong>Contact No:</strong> {cinfo.c_no}</p>
          </section>
        )}

        {Images && Images.length > 0 && (
          <section className="section">
            <h2>Uploaded Image</h2>
            <div className="image-gallery">
              {Images.map((image) => (
                <img
                  key={image.id}
                  src={`http://localhost:5000/images/${image.filename}`}
                  alt="User"
                  className="uploaded-image"
                />
              ))}
            </div>
          </section>
        )}

        <footer className="issuer-info">
          <h3>Issued by:</h3>
          <p><strong>Loading...</strong></p>
        </footer>
      </div>
    </div>
  );
};

export default Profile;