import oauthSignature from "oauth-signature";
import { request } from "../../configs/axios";
import { AxiosResponse } from "axios";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { PostMessageParamArgType } from "../../types";
import { useDispatch } from "react-redux";
import { setOTP } from "../redux/features/userSlice";
import CryptoJS from 'crypto-js';

/*
  Note: CORS (Cross-Origin Resource Sharing) Issue

  I encountered a CORS issue while implementing this API request due to the use of a free Twitter developer account. 

  Unfortunately, I was unable to test the actual request and receive valid responses because error 413 and CORS restrictions.

  The implementation here is based on the object structure provided in Twitter's documentation, assuming a successful request. 

  Please be aware that blind implementation without live API testing may lead to unanticipated issues when interacting with the Twitter API without CORS restrictions. 
  
*/

export const useSendDirectMessage = () => {
  const [isError, setError] = useState<any>();
  const dispatch = useDispatch();

  //Async function to send a direct message using Twitter API
  const postMessage = async (url: string, { arg }: PostMessageParamArgType) => {

    // Function to generate a random OAuth nonce
    const generateOAuthNonce = () => {
      const nonce = Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
      return nonce;
    };

    // Function to generate a timestamp for OAuth
    const generateOAuthTimestamp = () => {
      return Math.floor(Date.now() / 1000).toString();
    };

    // Function to generate OAuth signature with oauthSignature npm package
    const generateOAuthSignature = (
      method: string,
      url: string,
      parameters: {
        oauth_consumer_key?: string;
        oauth_nonce: string;
        oauth_signature_method: string;
        oauth_timestamp: string;
        oauth_token?: string;
        oauth_version?: string;
      }
    ) => {
      const consumerSecret = arg?.secretKey;
      const tokenSecret = arg?.oauthSecret;
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
      return signature;
    };

    // Try/Catch block
    try {
      // generateOAuthNonce funtion call
      const oauthNonce = generateOAuthNonce();

      // generateOAuthTimestamp function call
      const oauthTimestamp = generateOAuthTimestamp();

      //generateOAuthSignature function call with params
      const oauthSignature = generateOAuthSignature(
        "POST",
        "https://api.twitter.com/1.1/direct_messages/events/new.json",
        {
          oauth_consumer_key: arg?.apiKey,
          oauth_nonce: oauthNonce,
          oauth_signature_method: "HMAC-SHA1",
          oauth_timestamp: oauthTimestamp,
          oauth_token: arg?.oauthToken,
          oauth_version: "1.0",
        }
      );

      // Headers for the API request
      const headers = {
        "Content-Type": "application/json",
        Authorization: `OAuth oauth_consumer_key=${arg?.apiKey}, oauth_nonce="${oauthNonce}", oauth_signature="${oauthSignature}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${oauthTimestamp}", oauth_token="${arg?.oauthToken}", oauth_version="1.0"`,
      };

      // Data payload for the direct message. Send OTP in "text" key
      const data = {
        event: {
          type: "message_create",
          message_create: {
            target: {
              recipient_id: arg?.recipientID, //Recipient ID aka authenticated user ID
            },
            message_data: {
              text: arg?.otp, //OTP sent in text key
            },
          },
        },
      };

      // API request to send direct message using axios
      const response: AxiosResponse<any, any> = await request.post(url, data, {
        headers,
      });

      // Encrypt geneated OTP
       const encryptedOTP = CryptoJS.AES.encrypt(arg?.otp, '001').toString();

       // {/*NOTE: i am add this store here without IF condition because i do not see the response due to 403 forbidden error. i do this presuming a sucessful response}
      // Store encrypted otp in redux store if direct message is successful
      dispatch(setOTP(encryptedOTP))

      // Return response
      return response;
    } catch (error) {
      console.error("Error making API request:", error);
      setError(error);
    }
  };

  // SWR mutation to trigger the API request
  const { trigger, data, isMutating } = useSWRMutation(
    `/1.1/direct_messages/events/new.json`,
    postMessage
  );

  return { isMutating, trigger, isError, data };
};
