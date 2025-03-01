import QRCode from "qrcode";
import { useState, useRef } from "react";

export const useQRCodeGenerator = () => {
  const downloadRef = useRef(null);
  const downloadController = useRef(new AbortController());

  const [inputURL, setInputURL] = useState("");
  const [qrData, setQRData] = useState("");
  const [inputVisibility, setInputVisibility] = useState(true);

  const generateQRCode = () => {
    // Cancel any ongoing download before generating a new QR code
    downloadController.current.abort();
    downloadController.current = new AbortController();

    QRCode.toDataURL(
      inputURL,
      { width: 200, margin: 2, color: { dark: "#218c1a", light: "#FFFFFFFF" } },
      (err, url) => {
        if (err) {
          console.error("Error generating QR code:", err);
          // Handle error, if any
        } else {
          setQRData(url);
          setInputVisibility(false);
        }
      }
    );
  };

  const downloadQRCode = () => {
    const shouldDownload = window.confirm("Do you want to download the QR code?");
    if (!shouldDownload) {
      // User chose to abort the download
      return;
    }

    const getFileName = () => {
      let fileName = prompt("Enter the filename for the QR code", "qrcode");
      if (!fileName || fileName.trim() === "") {
        return getFileName();
      }
      return fileName;
    };

    const fileName = getFileName();
    if (!fileName) {
      // User canceled the download
      return;
    }

    const formattedFileName = fileName.replace(/\s+/g, "_");

    // Using the downloadRef to store the download link reference
    downloadRef.current = document.createElement("a");
    downloadRef.current.href = qrData;
    downloadRef.current.download = `${formattedFileName}.png`;
    downloadRef.current.target = "_blank"; // Open in a new tab to trigger the download

    document.body.appendChild(downloadRef.current);
    downloadRef.current.click();
    document.body.removeChild(downloadRef.current);
  };

  const repeatAction = () => {
    setInputURL("");
    setQRData("");
    setInputVisibility(true);
  };

  return {
    inputURL,
    setInputURL,
    qrData,
    inputVisibility,
    generateQRCode,
    downloadQRCode,
    repeatAction,
  };
};
