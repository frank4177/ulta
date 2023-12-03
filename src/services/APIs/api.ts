import oauthSignature from "oauth-signature";
import { request } from "../../configs/axios";
import { AxiosResponse } from "axios";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { TokenReponse } from "../../types";


/*
  Note: CORS (Cross-Origin Resource Sharing) Issue

  I encountered a CORS issue while implementing this API request due to the use of a free Twitter developer account. 

  Unfortunately, I was unable to test the actual request and receive valid responses because of CORS restrictions.

  The implementation here is based on the object structure provided in Twitter's documentation, assuming a successful request. 

  Please be aware that blind implementation without live API testing may lead to unanticipated issues when interacting with the Twitter API without CORS restrictions. 
  
*/



export const useSendDirectMessage = (secretKey: string, tokenresp: TokenReponse, apiKey: string, isOTP: number) => {
    const [isError, setError] = useState<any>()  

    // Function to generate a random OAuth nonce
    const generateOAuthNonce = () => {
        return Math.random();
      };
    

      // Function to generate a timestamp for OAuth
      const generateOAuthTimestamp = () => {
        return Math.floor(Date.now() / 1000).toString();
      };
    
      // Function to generate OAuth signature for the API request
      const generateOAuthSignature = (
        method: string,
        url: string,
        parameters: {
          oauth_consumer_key: string; 
          oauth_nonce: number;
          oauth_signature_method: string;
          oauth_timestamp: string;
          oauth_token: string;
          oauth_version: string;
        }
      ) => {
        const consumerSecret = secretKey; 
        const tokenSecret = tokenresp?.oauthTokenSecret; 
    
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

      // Function to send a direct message using Twitter API
       const postMessage = async (url: string, { arg }: any) => {
        try {
          const apiUrl = "https://api.twitter.com/1.1/direct_messages/events/new.json";
          const oauthNonce = generateOAuthNonce();
          const oauthTimestamp = generateOAuthTimestamp();
          const oauthSignature = generateOAuthSignature("POST", apiUrl, {
            oauth_consumer_key: apiKey,
            oauth_nonce: oauthNonce,
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: oauthTimestamp,
            oauth_token: arg?.accessToken,
            oauth_version: "1.0",
          });


          // Headers for the API request
          const headers = {
            "Content-Type": "application/json",
            Authorization: `OAuth oauth_consumer_key=${apiKey}, oauth_nonce="${oauthNonce}", oauth_signature="${oauthSignature}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${oauthTimestamp}", oauth_token="${arg?.accessToken}", oauth_version="1.0"`,
          };


          // Data payload for the direct message
          const data = {
            event: {
              type: "message_create",
              message_create: {
                target: {
                  recipient_id: arg?.user?.providerData[0]?.uid,
                },
                message_data: {
                  text: isOTP ,
                },
              },
            },
          };

           // API request using axios
          const response: AxiosResponse<any, any> = await request.post(url, data, { headers });

      
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