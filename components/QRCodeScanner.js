// // components/QRCodeScanner.js
// import React, { useState, useRef, useEffect } from "react";
// import { BrowserMultiFormatReader } from "@zxing/browser";

// const QRCodeScannerComponent = ({ onScan }) => {
//   const [showScanner, setShowScanner] = useState(false);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     let codeReader;

//     if (showScanner) {
//       codeReader = new BrowserMultiFormatReader();
//       codeReader.decodeFromVideoDevice(
//         null,
//         videoRef.current,
//         (result, error) => {
//           if (result) {
//             onScan(result.text);
//           }
//           if (error) {
//             console.error(error);
//           }
//         }
//       );
//     }

//     return () => {
//       if (codeReader) {
//         codeReader.reset();
//       }
//     };
//   }, [showScanner, onScan]);

//   return (
//     <div>
//       <button
//         onClick={() => setShowScanner(!showScanner)}
//         className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         {showScanner ? "Close Scanner" : "สแกน QR Code"}
//       </button>
//       {showScanner && (
//         <div>
//           <video ref={videoRef} style={{ width: "100%" }} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default QRCodeScannerComponent;
