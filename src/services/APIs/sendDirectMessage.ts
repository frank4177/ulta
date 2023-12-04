import oauthSignature from "oauth-signature";
import { request } from "../../configs/axios";
import { AxiosResponse } from "axios";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { PostMessageParamArgType} from "../../types";


/*
  Note: CORS (Cross-Origin Resource Sharing) Issue

  I encountered a CORS issue while implementing this API request due to the use of a free Twitter developer account. 

  Unfortunately, I was unable to test the actual request and receive valid responses because of CORS restrictions.

  The implementation here is based on the object structure provided in Twitter's documentation, assuming a successful request. 

  Please be aware that blind implementation without live API testing may lead to unanticipated issues when interacting with the Twitter API without CORS restrictions. 
  
*/



export const useSendDirectMessage = () => {
    const [isError, setError] = useState<any>()  

  //Async function to send a direct message using Twitter API
   const postMessage = async (url: string, { arg }: PostMessageParamArgType) => {

    // Function to generate a random OAuth nonce
    const generateOAuthNonce = () => {
      const nonce = Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
        return nonce
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

        try {
          // generateOAuthNonce funtion call
          const oauthNonce = generateOAuthNonce();

          // generateOAuthTimestamp function call
          const oauthTimestamp = generateOAuthTimestamp();
          

          //generateOAuthSignature function call with params
          const oauthSignature = generateOAuthSignature("POST", "https://api.twitter.com/1.1/direct_messages/events/new.json", {
            oauth_consumer_key: arg?.apiKey,
            oauth_nonce: oauthNonce,
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: oauthTimestamp,
            oauth_token: arg?.oauthToken,
            oauth_version: "1.0",
          });

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
                  text: arg?.otp , //OTP sent in text key
                },
              },
            },
          };

           // API request to send direct message using axios
          const response: AxiosResponse<any, any> = await request.post(url, data, { headers });

          
           // Check if headers are present
          if (response.headers) {
          // Log rate limit information from response headers
          const rateLimitLimit = response.headers['x-rate-limit-limit'];
          const rateLimitRemaining = response.headers['x-rate-limit-remaining'];
          const rateLimitReset = response.headers['x-rate-limit-reset'];

          console.log('Rate Limit Information:');
          console.log('Limit:', rateLimitLimit);
          console.log('Remaining:', rateLimitRemaining);
          console.log('Reset Time:', new Date(parseInt(rateLimitReset) * 1000));
        }
      
          // Return response
          return response
        } catch (error) {
          console.error("Error making API request:", error);
          setError(error)
        }
      };

      // SWR mutation to trigger the API request
      const { trigger, data, isMutating,  } = useSWRMutation(
        `/1.1/direct_messages/events/new.json`,
        postMessage
      );
     
  
    return { isMutating, trigger, isError, data  };
  };