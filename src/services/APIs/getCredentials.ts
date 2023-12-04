import { useNavigate } from "react-router-dom";
import { request } from "../../configs/axios";
import useSWRMutation from "swr/mutation";
import {useState} from "react"
import { useDispatch } from "react-redux";
import { login } from "../redux/features/userSlice";
import { getCredentialParamArgType } from "../../types";
import oauthSignature from "oauth-signature";


/*
  Note: CORS (Cross-Origin Resource Sharing) Issue

  I encountered a CORS issue while implementing this API request due to the use of a free Twitter developer account. 

  Unfortunately, I was unable to test the actual request and receive valid responses because of CORS restrictions.

  The implementation here is based on the object structure provided in Twitter's documentation, assuming a successful request. 

  Please be aware that blind implementation without live API testing may lead to unanticipated issues when interacting with the Twitter API without CORS restrictions. 
  
*/

export const useGetCredentials = ()=>{
    const navigate = useNavigate();
    const [isError, setError] = useState<any>()
    const dispatch = useDispatch();


    //Async function to get and verify user credentials from the Twitter API
    const getCredentials = async (url: string, {arg}: getCredentialParamArgType)=>{ 

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
        const consumerSecret = arg?.twitterData?.secretKey; 
        const tokenSecret = arg?.twitterData?.oauthSecret; 
    
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
     
      // params of API request
       const params = {
          include_entities: false,
          skip_status: true,
          include_email: true
        };
    
        try {
           // generateOAuthNonce funtion call
           const oauthNonce = generateOAuthNonce();

           // generateOAuthTimestamp function call
           const oauthTimestamp = generateOAuthTimestamp();
           
           //generateOAuthSignature function call with params
           const oauthSignature = generateOAuthSignature("POST", "https://api.twitter.com/1.1/account/verify_credentials.json", {
             oauth_consumer_key: arg?.twitterData?.apiKey,
             oauth_nonce: oauthNonce,
             oauth_signature_method: "HMAC-SHA1",
             oauth_timestamp: oauthTimestamp,
             oauth_token: arg?.twitterData?.oauthToken,
             oauth_version: "1.0",
           });

          // API request to get user credentials request using axios
          const res = await request.get(url, {
            params: params,
            headers: {
              Authorization: `OAuth oauth_consumer_key=${arg?.twitterData?.apiKey}, oauth_nonce="${oauthNonce}", oauth_signature="${oauthSignature}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${oauthTimestamp}", oauth_token="${arg?.twitterData?.oauthToken}", oauth_version="1.0"`,

            }
          });

          // Access the response data
          const responseData = res.data;
    
          //OTP Check. Navigate to dashboard if form inputed OTP is same with "text" in response
          if (arg?.otpConfirmationCode === responseData?.status?.text) {
            dispatch(login("authorised"))
            navigate("/dashboard")
          }

          //return response
          return responseData
        } catch (error: any) {
          setError(error)
          if (error?.response) {
            console.error('Error status:', );
            console.error('Error data:', );
          } else if (error?.request) {
            // The request was made but no response was received
            console.error('No response received');
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', );
          }
        }
      }

      // SWR mutation to trigger the API request
      const { trigger, isMutating } = useSWRMutation(
        `/account/verify_credentials.json`,
        getCredentials
      );

      return {trigger , isMutating , isError};
}