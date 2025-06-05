import React, { useState } from "react";
import axios from "axios";

function NameForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    extension: "",
    IDNumber: "",
    UserType: "",
    Password: "",
    Position: "",
    ResidentType: "",
    HouseNo: "",
    ZoneNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send login data first to create the account
      const resLogin = await axios.post("https://brgyback.onrender.com/login/add", formData);
      const account_id = resLogin.data.id; // Make sure this is returned from backend

      // 2. Send name data with the account_id
      const nameData = {
        ...formData,
        account_id: account_id,
      };

      const resName = await axios.post("https://brgyback.onrender.com/name/add", nameData);

      // 3. Success messages
      alert(resLogin.data.message);
      alert(resName.data.message);

      // 4. Reset form
      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        extension: "",
        IDNumber: "",
        UserType: "",
        Password: "",
        Position: "",
        ResidentType: "",
        HouseNo: "",
        ZoneNo: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-grid">
        <div>
          <label>First Name:</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>

        <div>
          <label>Middle Name:</label>
          <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} />
        </div>

        <div>
          <label>Last Name:</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
        </div>

        <div>
          <label>Extension:</label>
          <input type="text" name="extension" value={formData.extension} onChange={handleChange} />
        </div>

        <div>
          <label>ID Number:</label>
          <input type="text" name="IDNumber" value={formData.IDNumber} onChange={handleChange} required />
        </div>

        <div>
          <label>Usertype:</label>
          <input type="text" name="UserType" value={formData.UserType} onChange={handleChange} required />
        </div>

        <div>
          <label>Password:</label>
          <input type="password" name="Password" value={formData.Password} onChange={handleChange} required />
        </div>

        <div>
          <label>Position:</label>
          <input type="text" name="Position" value={formData.Position} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="ResidentType">Resident Type:</label>
          <select name="ResidentType" value={formData.ResidentType} onChange={handleChange} required>
            <option value="">Resident</option>
            <option value="Temporary">Temporary</option>
            <option value="Permanent">Permanent</option>
            <option value="Native">Native</option>
          </select>
        </div>

        <div>
          <label>House No:</label>
          <input type="number" name="HouseNo" value={formData.HouseNo} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="ZoneNo">Zone No:</label>
          <select name="ZoneNo" value={formData.ZoneNo} onChange={handleChange} required>
            <option value="">Purok #</option>
            <option value="1">Zone 1</option>
            <option value="2">Zone 2</option>
          </select>
        </div>
      </div>

      <div className="submit-container">
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default NameForm;
