import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// function MyApp({ Component, pageProps }) {
//   const [liffObject, setLiffObject] = useState(null);
//   const [liffError, setLiffError] = useState(null);

//   // Execute liff.init() when the app is initialized
//   useEffect(() => {
//     console.log("start liff.init()...");
//     liff
//       .init({ liffId: process.env.LIFF_ID })
//       .then(() => {
//         console.log("liff.init() done");
//         setLiffObject(liff);
//       })
//       .catch((error) => {
//         console.log(`liff.init() failed: ${error}`);
//         if (!process.env.liffId) {
//           console.info(
//             "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
//           );
//         }
//         setLiffError(error.toString());
//       });
//   }, []);

//   // Provide `liff` object and `liffError` object
//   // to page component as property
//   pageProps.liff = liffObject;
//   pageProps.liffError = liffError;
//   return <Component {...pageProps} />;
// }

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} /> <ToastContainer />
    </>
  );
}

export default MyApp;
