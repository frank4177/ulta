// import { useNavigate } from "react-router-dom";
import { authentication } from "../configs/firebase-config";
import { TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import axios from "axios";
// import otpGenerator from "otp-generator";
import oauthSignature from "oauth-signature";

const apiKey = import.meta.env.VITE_TWITTER_KEY 
const secretKey = import.meta.env.VITE_SECRETE_KEY 



const Home = () => {
  // const navigate = useNavigate();
  const [userData, setUserData] = useState<any>();
  const [tokenresp, setTokenResp] = useState<any>();
  const [ress, setRes] = useState<any>();
  const [recipientID, setRecipientId] = useState<any>();

  console.log(ress);
  console.log(userData);

  console.log(recipientID);

  const generateOAuthNonce = () => {
    // Generate a random nonce
    return Math.random();
  };

  const generateOAuthTimestamp = () => {
    // Generate a timestamp
    return Math.floor(Date.now() / 1000).toString();
  };

  const generateOAuthSignature = (
    method: string,
    url: string,
    parameters: {
      oauth_consumer_key: string; // Replace with your Twitter app's consumer key
      oauth_nonce: number;
      oauth_signature_method: string;
      oauth_timestamp: string;
      oauth_token: any;
      oauth_version: string;
    }
  ) => {
    // Implement your logic for generating the signature
    // This example uses the oauth-signature library
    const consumerSecret = secretKey; // Replace with your Twitter app's consumer secret
    const tokenSecret = tokenresp?.oauthTokenSecret; // Make sure to have the user's access token secret

    const signature = oauthSignature.generate(
      method,
      url,
      parameters,
      consumerSecret,
      tokenSecret,
      {
        encodeSignature: false,
      }
    );

    console.log(signature);

    return signature;
  };

  const signTwitter = () => {
    const provider = new TwitterAuthProvider();
    signInWithPopup(authentication, provider)
      .then((res: any) => {
        // console.log(res);

        // Generate OTP
        //  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true });

        if (res?.user?.displayName) {
          // navigate("/dashboard");
          setUserData(res);
          setTokenResp(res?._tokenResponse);
          setRecipientId(res?.user?.providerData[0]?.uid);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeApiRequest = async () => {
    try {
      const url = "https://api.twitter.com/1.1/direct_messages/events/new.json";
      const oauthNonce = generateOAuthNonce();
      const oauthTimestamp = generateOAuthTimestamp();
      const oauthSignature = generateOAuthSignature("POST", url, {
        oauth_consumer_key: apiKey, // Replace with your Twitter app's consumer key
        oauth_nonce: oauthNonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: oauthTimestamp,
        oauth_token: userData?.accessToken,
        oauth_version: "1.0",
      });

      const headers = {
        "Content-Type": "application/json",
        Authorization: `OAuth oauth_consumer_key=${apiKey}, oauth_nonce="${oauthNonce}", oauth_signature="${oauthSignature}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${oauthTimestamp}", oauth_token="${tokenresp?.oauthAccessToken}", oauth_version="1.0"`,
      };

      const data = {
        event: {
          type: "message_create",
          message_create: {
            target: {
              recipient_id: recipientID,
            },
            message_data: {
              text: "Hello World!",
            },
          },
        },
      };

      const response = await axios.post(url, data, { headers });
      setRes(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error making API request:", error);
    }
  };

  return (
    <>
      <div className="dashboard">
        <button onClick={() => signTwitter()}>twitter</button>
        <button onClick={() => makeApiRequest()}>make</button>
      </div>
    </>
  );
};

export default Home;
