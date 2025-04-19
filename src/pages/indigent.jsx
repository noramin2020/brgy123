import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/Cert.css";
import certtemplate from "../assets/final_1.png";
import logo2 from "../assets/logo.png";
import logo1 from "../assets/logo1.png";
import logoImage from "../assets/logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import QRCode from "react-qr-code";
import CryptoJS from "crypto-js";

const Indigent = () => {
  const ref = useRef(null);

  const [account_id, setAccountId] = useState(localStorage.getItem("IDNumber") || "");
  const [first_name, setFirstName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [last_name, setLastName] = useState("");
  const [extension, setExtension] = useState("");
  const [purpose, setPurpose] = useState("");
  const [HouseNo, setHouseNo] = useState("");
  const [ZoneNo, setZoneNo] = useState("");
  const [occupation, setOccupation] = useState("");
  const [fmi, setFmi] = useState("");
  const [certificateType, setCertificateType] = useState("barangay");


  const [issuerfirst_name, setIssuerfirst_name] = useState(null);
  const [issuerlast_name, setIssuerlast_name] = useState(null);
  const [issuerPosition, setIssuerPosition] = useState(null);
  

  const [date, setDate] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });


  useEffect(() => {
    if (account_id.trim() !== "") {
      axios.get(`http://localhost:5000/i_info/${account_id}`)
        .then((res) => {
          const user = res.data[0];
          setOccupation(user.occupation || "");
          setFmi(user.fmi || "");
        })
        .catch((err) => {
          console.error("Error fetching occupation/FMI:", err);
          setOccupation("");
          setFmi("");
        });
    }
  }, [account_id]);
  
  


  useEffect(() => {
    if (account_id.trim() === "") return;

    axios.get(`http://localhost:5000/cert/${account_id}`)
      .then((res) => {
        const user = res.data[0];
        setFirstName(user.first_name || "");
        setMiddleName(user.middle_name || "");
        setLastName(user.last_name || "");
        setExtension(user.extension || "");
        setHouseNo(user.HouseNo || ""); // 🏠 Add this
        setZoneNo(user.ZoneNo || "");      // 🏘️ Add this
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setExtension("");
        setHouseNo("");
        setZoneNo("");
      });
  }, [account_id]);

  useEffect(() => {
    const loggedInIDNumber = localStorage.getItem("IDNumber");

    if (!loggedInIDNumber) return;

    axios.get(`http://localhost:5000/user/${loggedInIDNumber}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const issuer = res.data[0];
          setIssuerfirst_name(issuer.first_name || "");
          setIssuerlast_name(issuer.last_name || "");
          setIssuerPosition(issuer.position || "");
        }
      })
      .catch((err) => {
        console.error("Error fetching issuer data:", err);
      });
  }, []);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) return;

    html2canvas(ref.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a4")

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("IndigentCertificate.pdf");
    });
  }, []);

  const encryptData = (data, password) => {
    return CryptoJS.AES.encrypt(data, password).toString();
  };

  const encryptedQRCodeValue = encryptData(
    `Name: ${last_name}, ${extension} ${first_name} ${middle_name}\nID: ${account_id}\nOccupation: ${occupation}\nIncome: ${fmi}\nPurpose: ${purpose}\nDate: ${date}`,
    account_id
  );
  const getFormattedDate = () => {
    const now = new Date();
    const month = now.getMonth() + 1; // months are 0-indexed
    const day = now.getDate();
    
    // Format as MMDD (e.g., "0111" for January 1)
    return `${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  };

  return (
    <div className="indigent-wrapper">
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
        <button onClick={onButtonClick}>Download PDF</button>
      </div>
      <select value={certificateType} onChange={(e) => setCertificateType(e.target.value)}>
  <option value="barangay">Barangay Certificate</option>
  <option value="indigency">Indigency Certificate</option>
</select>


      <div className="container" ref={ref}>
      <div className="content">
  {/* Header Section */}
  <div className="header">
    <div className="logo1"><img src={logo1} /></div>
    <div className="header-content">
      <h1>Republic of the Philippines</h1>
      <h2>Bangsamoro Autonomous Region in Muslim Mindanao</h2>
      <h3>Province of Lanao Del Sur</h3>
      <h4>Islamic City of Marawi</h4>
      <h5>ROROGAGUS EAST</h5>
      <div className="typecert">
        <h1>Office of the Barangay Chairman</h1>
      </div>
      <div className="certificatio">
        <h1>{certificateType === "barangay" ? "CERTIFICATE" : "INDIGENT CERTIFICATE"}</h1>
      </div>
    </div>
    <div className="logo2"><img src={logo2} /></div>
  </div>

  <h1>TO WHOM IT MAY CONCERN;</h1>

  {certificateType === "barangay" ? (
  <>
    <h2>This is to CERTIFY that per records available in this Office,{" "}
      <strong>{last_name}, {extension} {first_name} {middle_name}</strong> is a bonafide resident of this Barangay since birth.
    </h2>
  </>
) : (
  <>
    <h2>This is to CERTIFY that per records available in this Office,{" "}
      <strong>{last_name}, {extension} {first_name} {middle_name}</strong>, a <strong>{occupation || "no occupation"}</strong> with an income of <strong>{fmi || "no fmi"}</strong>, is a bonafide indigent resident of this Barangay since birth.
    </h2>
  </>
)}


  <h3>This further certifies that the above-named person has no pending and or derogatory record file against him/her as of this date.</h3>

  <h4>This certification is issued upon the request of the above-named person to support his/her <strong>{purpose}</strong>.</h4>

  <h6>Issued on this <strong>{date}</strong>, at Barangay Rorogagus East, Marawi City, Lanao Del Sur, 9700</h6>

  <h5><strong>{account_id} | {HouseNo}{ZoneNo} | {getFormattedDate()}</strong></h5>

  <div className="chairman">
    <h1>HON. JAMAL D. BATABOR</h1>
    <h2>Barangay Chairman</h2>
  </div>

  <div className="qrcode">
    <h3>Do not accept if no QR code and Dry Seal of the Barangay</h3>
    <QRCode
      value={encryptedQRCodeValue}
      size={100}
      fgColor="#000000"
      bgColor="#ffffff"
      level="H"
      includeMargin={true}
      imageSettings={{
        src: logoImage,
        height: 20,
        width: 20,
        excavate: true
      }}
    />
  </div>

  <div className="issuer-info">
    <h1>Processed By:</h1>
    <h2>{issuerfirst_name && issuerlast_name ? `${issuerfirst_name} ${issuerlast_name}` : "Office of the Barangay"}</h2>
    <h3>{issuerPosition ? issuerPosition : ""}</h3>
  </div>
</div>

      </div>
    </div>
  );
};

export default Indigent;
