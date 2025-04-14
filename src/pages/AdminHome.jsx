import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ImageUpload() {
  const [accountId, setAccountId] = useState(localStorage.getItem("IDNumber")); // Get logged-in user's ID
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState(null); // Store the image URL

  useEffect(() => {
    fetchImage();
  }, [accountId]);

  // Fetch the image from the backend
  const fetchImage = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/image/${accountId}`);
      if (response.data.imageUrl) {
        setImageUrl(response.data.imageUrl); // Set the image URL
      } else {
        setImageUrl(null); // Reset if no image URL is returned
      }
    } catch (err) {
      console.error("Error fetching image:", err);
      setError("Failed to fetch image.");
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("img", image);
    formData.append("account_id", accountId);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/image/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message || "Image uploaded successfully.");
      fetchImage(); // Refresh the image after upload
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Image Upload</h1>
      <form onSubmit={handleImageUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>Uploaded Image</h2>
          <img
            src={imageUrl} // Use the image URL returned from the backend
            alt="Uploaded"
            style={{ maxWidth: "300px", maxHeight: "300px" }}
          />
        </div>
      )}
      <Link to="/logout"><button>Logout</button></Link>
    </div>
  );
}

export default ImageUpload;