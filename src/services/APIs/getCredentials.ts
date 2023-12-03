import { useNavigate } from "react-router-dom";
import { request } from "../../configs/axios";
import useSWRMutation from "swr/mutation";
import {useState} from "react"
import { useDispatch } from "react-redux";
import { login } from "../redux/features/userSlice";


/*
  Note: CORS (Cross-Origin Resource Sharing) Issue

  I encountered a CORS issue while implementing this API request due to the use of a free Twitter developer account. 

  Unfortunately, I was unable to test the actual request and receive valid responses because of CORS restrictions.

  The implementation here is based on the object structure provided in Twitter's documentation, assuming a successful request. 

  Please be aware that blind implementation without live API testing may lead to unanticipated issues when interacting with the Twitter API without CORS restrictions. 
  
*/

export const useGetCredentials = ( userData?: any)=>{
    const navigate = useNavigate();
    const [isError, setError] = useState<any>()
    const dispatch = useDispatch();

    // Function to fetch user credentials from the Twitter API
    const getCredentials = async (url: string, {arg}: any)=>{
       const params = {
          include_entities: false,
          skip_status: true,
          include_email: true
        };
    
        try {
    
          const res = await request.get(url, {
            params: params,
            headers: {
              'Authorization': `Bearer ${userData?.accessToken}`
            }
          });

          // Access the response data
          const responseData = res.data;
    
   

          //OTP check. Navigate to dashboard if inputed otp is same with text in response
          if (arg === responseData?.status?.text) {
            dispatch(login("authorised"))
            navigate("/dashboard")
          }
          return res
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