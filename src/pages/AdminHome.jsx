import React, { useState, useEffect } from "react";
import axios from "axios";
import PinfoModal from "../Modal/pinfomodal";
import IinfoModal from "../Modal/iinfomodal";
import CinfoModal from "../Modal/cinfomodal"; 
import "../styles/pages.css";
import ImageUpload from "../components/image"; // adjust path if needed

function InfoRecordsPage() {
  const [userData, setUserData] = useState(null);
  const [pinfo, setPinfo] = useState(null);
  const [incomeInfo, setIncomeInfo] = useState(null);
  const [cinfo, setCinfo] = useState(null);
  const [pinfoModalOpen, setPinfoModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [cinfoModalOpen, setCinfoModalOpen] = useState(false);
  const [loadingPinfo, setLoadingPinfo] = useState(false);
  const [loadingIncome, setLoadingIncome] = useState(false);
  const [loadingCinfo, setLoadingCinfo] = useState(false);

  const account_id = localStorage.getItem("IDNumber");

  useEffect(() => {
    fetchUserData();
    fetchUserPinfo();
    fetchIncomeInfo();
    fetchUserCinfo();
  }, [account_id]);

  const fetchUserData = async () => {
    if (!account_id) {
      alert("Account ID is missing.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/name/${account_id}`);
      if (response.data?.length > 0) {
        setUserData(response.data[0]);
      } else {
        alert("No user data found.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      alert("Failed to fetch user data.");
    }
  };

  const fetchUserPinfo = async () => {
    setLoadingPinfo(true);
    try {
      const response = await axios.get(`http://localhost:5000/userpinfo/${account_id}`);
      setPinfo(response.data);
    } catch (err) {
      console.error(err);
      setPinfo(null);
    } finally {
      setLoadingPinfo(false);
    }
  };

  const fetchIncomeInfo = async () => {
    setLoadingIncome(true);
    try {
      const response = await axios.get(`http://localhost:5000/i_info/${account_id}`);
      setIncomeInfo(response.data);
    } catch (err) {
      console.error(err);
      setIncomeInfo(null);
    } finally {
      setLoadingIncome(false);
    }
  };

  const fetchUserCinfo = async () => {
    setLoadingCinfo(true);
    try {
      const response = await axios.get(`http://localhost:5000/usercinfo/${account_id}`);
      const data = response.data;

      if (Array.isArray(data)) {
        setCinfo(data);
      } else if (data) {
        setCinfo([data]); // wrap single object in array
      } else {
        setCinfo([]);
      }
    } catch (err) {
      console.error(err);
      setCinfo([]);
    } finally {
      setLoadingCinfo(false);
    }
  };

  const handleSavePinfo = async (formData) => {
    try {
      const payload = { ...formData, account_id };
      const response = await axios.post("http://localhost:5000/userpinfo/add", payload);
      alert(response.data.message || "Saved successfully");
      fetchUserPinfo();
      setPinfoModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save personal info");
    }
  };

  const handleSaveIncomeInfo = async (formData) => {
    try {
      const payload = { ...formData, account_id };
      const response = await axios.post("http://localhost:5000/i_info/add", payload);
      alert(response.data.message || "Saved successfully");
      fetchIncomeInfo();
      setIncomeModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save income info");
    }
  };

  const handleSaveCinfo = async (formData) => {
    try {
      const payload = { ...formData, account_id };
      const response = await axios.post("http://localhost:5000/usercinfo/add", payload);
      alert(response.data.message || "Saved successfully");
      fetchUserCinfo();
      setCinfoModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save contact info");
    }
  };

  return (
    <div className="info-records-container">
      <div className="top-container">
        <div>
          <ImageUpload accountId={account_id} />
        </div>
        <div className="user-info-container">
          {userData && (
            <div className="info-section">
              <h2>Logged-in User Information</h2>
              <p><strong>Name:</strong> {`${userData.first_name} ${userData.middle_name} ${userData.last_name} ${userData.extension}`}</p>
              <p><strong>Position:</strong> {userData.Position}</p>
              <p><strong>Resident Type:</strong> {userData.ResidentType}</p>
              <p><strong>House No:</strong> {userData.HouseNo}</p>
              <p><strong>Zone No:</strong> {userData.ZoneNo}</p>
              
            </div>
          )}
        </div>
      </div>

      <div className="info-columns">
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
            <p>No Personal information available.</p>
          )}
        </div>

        <div className="info-column">
          <h2>Your Income Information</h2>
          <button onClick={() => setIncomeModalOpen(true)}>{incomeInfo ? "Update" : "Add"}</button>
          {loadingIncome ? (
            <p>Loading...</p>
          ) : incomeInfo?.length > 0 ? (
            incomeInfo.map((info) => (
              <div key={info.id}>
                <p><strong>Occupation:</strong> {info.occupation}</p>
                <p><strong>Income:</strong> {info.fmi}</p>
              </div>
            ))
          ) : (
            <p>No Income information available.</p>
          )}
        </div>

        <div className="info-column">
          <h2>Your Contact Information</h2>
          <button onClick={() => setCinfoModalOpen(true)}>{cinfo ? "Update" : "Add"}</button>
          {loadingCinfo ? (
            <p>Loading...</p>
          ) : cinfo?.length > 0 ? (
            cinfo.map((info) => (
              <div key={info.id}>
                <p><strong>Gmail:</strong> {info.gmail}</p>
                <p><strong>Contact #:</strong> {info.c_no}</p>
              </div>
            ))
          ) : (
            <p>No contact information available.</p>
          )}
        </div>
      </div>

      <PinfoModal
        isOpen={pinfoModalOpen}
        onClose={() => setPinfoModalOpen(false)}
        onAdd={handleSavePinfo}
        initialData={pinfo}
      />

      <IinfoModal
        isOpen={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        onAdd={handleSaveIncomeInfo}
        initialData={incomeInfo ? incomeInfo[0] : null}
      />

      <CinfoModal
        isOpen={cinfoModalOpen}
        onClose={() => setCinfoModalOpen(false)}
        onAdd={handleSaveCinfo}
        initialData={cinfo ? cinfo[0] : null}
      />
    </div>
  );
}

export default InfoRecordsPage;
