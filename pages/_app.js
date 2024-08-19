import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);

  useEffect(() => {
    console.log("start liff.init()...");
    liff
      .init({ liffId: "2006057945-Nry8JeBK" })
      .then(() => {
        console.log("liff.init() done");

        liff.ready.then(() => {
          console.log("liff.ready() done");
          setLiffObject(liff);
        });
      })
      .catch((error) => {
        console.log(`liff.init() failed: ${error}`);
        if (!process.env.liffId) {
          console.info(
            "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
          );
        }
        setLiffError(error.toString());
      });
  }, []);

  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  return (
    <>
      <Component {...pageProps} /> <ToastContainer />
    </>
  );
}

export default MyApp;
