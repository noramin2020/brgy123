import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/image.css";

function Image() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("IDNumber");
    if (id) {
      setAccountId(id);
    } else {
      setMessage("User not logged in or IDNumber not found.");
    }
  }, []);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }
    if (!accountId) {
      setMessage("User ID is not available.");
      return;
    }

    const formdata = new FormData();
    formdata.append("image", file);
    formdata.append("account_id", accountId);
    formdata.append("isUpdate", images.length > 0);

    axios
      .post("https://brgyback.onrender.com/upload", formdata)
      .then((res) => {
        setMessage(res.data.message);
        setFile(null);
        fetchImages();
        updateSidebarImage();  // Update the image in the sidebar
      })
      .catch((err) => {
        console.error("Error:", err.response || err.message);
        setMessage("Upload failed.");
      });
  };

  const fetchImages = () => {
    if (!accountId) return;
    axios
      .get(`https://brgyback.onrender.com/images/${accountId}`)
      .then((res) => {
        setImages(res.data);
      })
      .catch((err) => {
        console.error("Error fetching images:", err);
      });
  };

  const updateSidebarImage = () => {
    if (images.length > 0) {
      const profileImage = images[0].filename; // Get the filename of the first image
      localStorage.setItem("profileImage", profileImage);  // Store the image filename in localStorage
    }
  };

  useEffect(() => {
    fetchImages();
  }, [accountId]);

  return (
    <div className="image-upload-container">
      <div className="file-input-wrapper">
        <input type="file" onChange={handleFile} />
      </div>

      <button className="upload-button" onClick={handleUpload}>
        {images.length > 0 ? "Update Image" : "Upload"}
      </button>

      {message && <p className="upload-message">{message}</p>}

      {images.length > 0 && (
        <div className="image-gallery">
          {images.map((img) => (
            <img
              key={img.id}
              src={`http://localhost:5000/images/${img.filename}`}
              alt="uploaded"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Image;
