import { authentication } from "../configs/firebase-config";
import { TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useSendDirectMessage } from "../services/APIs/sendDirectMessage";
import Button from "../component/Button";
import Spinners from "../component/Spinners";
import ResponseMessage from "../component/ResponseMessage";
import AuthForm from "../component/AuthForm";
import cryptoRandomString from "crypto-random-string";
import { PostMessageParamType } from "../types";
import { useDispatch } from "react-redux";
import { twitterData } from "../services/redux/features/userSlice";

const apiKey = import.meta.env.VITE_TWITTER_KEY;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const Home = () => {
  const dispatch = useDispatch();
  const [isAuthLoad, setAuthLoad] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    trigger: postMessage,
    isMutating,
    data,
    isError,
  } = useSendDirectMessage();


  // FUNCTION TO INITIATE TWITTER AUTHENTICATION
  const signTwitter = () => {
    setAuthLoad(true);
    setErrorMessage("");
    const provider = new TwitterAuthProvider();
    signInWithPopup(authentication, provider)
      .then((res: any) => {
        setAuthLoad(false);

        // Generate a secure otp
        const otp = parseInt(
          cryptoRandomString({ length: 5, type: "numeric" })
        );

        // post message params
        const postMessageParam: PostMessageParamType = {
          apiKey: apiKey,
          secretKey: secretKey,
          otp: otp,
          oauthSecret: res?._tokenResponse?.oauthTokenSecret,
          oauthToken: res?._tokenResponse?.oauthAccessToken,
          recipientID: res?.user?.providerData[0]?.uid,
          accessToken: res?.user?.accessToken
        };

        // If user data and access token are available, set state and send direct message.
        if (res?.user?.accessToken) {
          postMessage(postMessageParam);
          dispatch(twitterData(postMessageParam))
        }
      })
      .catch((err) => {
        console.log(err);
        setAuthLoad(false);
        setErrorMessage("Something went wrong. Try again");
      });
  };

  return (
    <>
      <div className="home">
        <div className="home__innerContainer">
          {data ? (
            // IF response from direct message api request was successful, display OTP auth form
            <AuthForm type="number" maxlength={5} />
          ) : (
            // Else display Login Twitter button and conditional elements
            <>
              {isAuthLoad ? (
                <Spinners />
              ) : (
                <Button handleClick={signTwitter} title="Login with twitter" />
              )}
              {isMutating ? <p>Sending direct message...</p> : null}

              {isError && !isAuthLoad ? (
                <ResponseMessage message="Sending OTP failed. Please try paid developer account :(" />
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
