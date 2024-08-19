import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    liff
      .init({ liffId: "2006057945-Nry8JeBK" }) // Initialize LIFF with your LIFF ID
      .then(() => {
        if (liff.isLoggedIn()) {
          liff
            .getProfile()
            .then((profile) => {
              const userId = profile.userId;
              const displayName = profile.displayName;
              const pictureUrl = profile.pictureUrl;
              const statusMessage = profile.statusMessage;

              console.log("User ID:", userId);
              console.log("Display Name:", displayName);
              console.log("Profile Picture URL:", pictureUrl);
              console.log("Status Message:", statusMessage);

              // You can use this information to update your UI or state
              setUserProfile({
                userId,
                displayName,
                pictureUrl,
                statusMessage,
              });
            })
            .catch((error) => {
              console.error("Error getting profile:", error);
              toast.error("Failed to get profile information.");
            });
        } else {
          liff.login(); // Redirect to LINE login if not logged in
        }
      })
      .catch((error) => {
        console.error("LIFF initialization failed:", error);
        toast.error("LIFF initialization failed.");
      }),
      [];
  });

  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  return (
    <>
      <Component {...pageProps} /> <ToastContainer />
    </>
  );
}

export default MyApp;
