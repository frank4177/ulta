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
import { twitterData, userData } from "../services/redux/features/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux/store";
import Avatar from "../component/Avatar";

const apiKey = import.meta.env.VITE_TWITTER_KEY;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const Home = () => {
  const dispatch = useDispatch();
  const myData = useSelector((state: RootState) => state?.user?.userData);
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

        const user_data = {
          screenName: res?._tokenResponse?.screenName,
          displayName: res?._tokenResponse?.displayName,
          photoUrl: res?._tokenResponse?.photoUrl,
          userId: res?.user?.providerData[0]?.uid,
          lastLogin: res?.user?.metadata?.lastSignInTime,
        };

        // post message params
        const postMessageParam: PostMessageParamType = {
          apiKey: apiKey,
          secretKey: secretKey,
          otp: otp.toString(),
          oauthSecret: res?._tokenResponse?.oauthTokenSecret,
          oauthToken: res?._tokenResponse?.oauthAccessToken,
          recipientID: res?.user?.providerData[0]?.uid,
          accessToken: res?.user?.accessToken,
        };

        // If user data and access token are available, set state and send direct message.
        if (res?.user?.accessToken) {
          postMessage(postMessageParam);
          dispatch(twitterData(postMessageParam));
          dispatch(userData(user_data));
        }
      })
      .catch((err) => {
        console.log(err);
        setAuthLoad(false);
        setErrorMessage("Something went wrong. Please try again");
      });
  };

  return (
    <>
      <div className="home">
        <div className="home__innerContainer">

          {/* If user has been authenticated, show card with minimal user data */}
          {myData ? (
            <div className="home__innerContainer__displayCard">
              {/* If Photo is available, display photo */}
              {myData?.photoUrl ? <Avatar picUrl={myData?.photoUrl} /> : null}
              <p>{myData?.displayName}</p>
              <span>@{`${myData?.screenName}`}</span>
            </div>
          ) : null}

          {/*IF response from direct message api request was successful, display OTP auth form */}
          {data ? (
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
                <ResponseMessage
                  message={`Hey @${myData?.screenName}! Sending OTP failed. Please try paid developer account :(`}
                />
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
