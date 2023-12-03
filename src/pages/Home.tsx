import { authentication } from "../configs/firebase-config";
import { TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useSendDirectMessage } from "../services/APIs/api";
import { useGetCredentials } from "../services/APIs/getCredentials";
import Button from "../component/Button/Button";
import Spinners from "../component/Spinners";
import ResponseMessage from "../component/ResponseMessage";
import AuthForm from "../component/AuthForm";
import { TokenReponse } from "../types";

const apiKey = import.meta.env.VITE_TWITTER_KEY;
const secretKey = import.meta.env.VITE_SECRETE_KEY;

const Home = () => {
  const [userData, setUserData] = useState<any>();
  const [tokenresp, setTokenResp] = useState<TokenReponse>({});
  const [isAuthLoad, setAuthLoad] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOTP, setIsOTP] = useState<number>(0);
  const {
    trigger: postMessage,
    isMutating,
    data,
    isError,
  } = useSendDirectMessage(secretKey, tokenresp, apiKey, isOTP);
  const {} = useGetCredentials(userData);

  // FUNCTION TO INITIATE TWITTER AUTHENTICATION
  const signTwitter = () => {
    setAuthLoad(true);
    setErrorMessage("");
    const provider = new TwitterAuthProvider();
    signInWithPopup(authentication, provider)
      .then((res: any) => {
        setAuthLoad(false);

        // Generate a random number between min and max as OTP
        const otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

        // If user data and access token are available, set state and send direct message
        if (res?.user?.accessToken) {
          setUserData(res);
          setTokenResp(res?._tokenResponse);
          setIsOTP(otp);
          postMessage(res);
        }
      })
      .catch((err) => {
        setAuthLoad(false);
        setErrorMessage("Something went wrong. Try again");
        console.log(err);
      });
  };

  return (
    <>
      <div className="home">
        <div className="home__innerContainer">
          {data ? (
            // IF DIRECT MESSAGE IS SENT SUCCESSFULLY DISPLAY OTP FORM
            <AuthForm type="number" maxlength={5} />
          ) : (
            // ELSE DISPLAY TWITTER AUTH BUTTON AND CONDITIONAL ELEMENTS
            <>
              {isAuthLoad ? (
                <Spinners />
              ) : (
                <Button handleClick={signTwitter} title="Login with twitter" />
              )}
              {isMutating ? <p>Sending direct message...</p> : null}

              {isError && !isAuthLoad ? (
                <ResponseMessage message="Sending OTP failed. :(" />
              ) : null}
            </>
          )}
          {errorMessage ? <ResponseMessage message={errorMessage} /> : null}
        </div>
      </div>
    </>
  );
};

export default Home;
