import React, { useState } from "react";
import CryptoJS from "crypto-js";

const DecryptPage = () => {
  const [accountId, setAccountId] = useState("");
  const [encryptedQRCodeData, setEncryptedQRCodeData] = useState("");
  const [decryptedData, setDecryptedData] = useState("");

  const decryptData = (encryptedData, password) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    return bytes.toString(CryptoJS.enc.Utf8); // Return the decrypted data
  };

  const handleDecrypt = () => {
    if (accountId && encryptedQRCodeData) {
      const decrypted = decryptData(encryptedQRCodeData, accountId);
      setDecryptedData(decrypted); // Set the decrypted data to display
    } else {
      alert("Please enter both Account ID and QR code data.");
    }
  };

  return (
    <div>
      <h2>Decrypt QR Code Data</h2>
      <input
        type="text"
        placeholder="Enter Account ID"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      />
      <textarea
        placeholder="Enter encrypted QR code data"
        value={encryptedQRCodeData}
        onChange={(e) => setEncryptedQRCodeData(e.target.value)}
      />
      <button onClick={handleDecrypt}>Decrypt</button>

      {decryptedData && (
        <div>
          <h3>Decrypted Data:</h3>
          <pre>{decryptedData}</pre>
        </div>
      )}
    </div>
  );
};

export default DecryptPage;
