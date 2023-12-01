import {useState} from "react";
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';


const Dashboard = () => {
  const [fail, setOnFail] = useState<any>()
  const [success, setIsSuccess] = useState<any>()

  console.log(success, fail)
  return (
    <>
      <div className="dashboard">
        <TwitterLogin
          loginUrl="https://ulta-nine.vercel.app/"
          onFailure={()=> setIsSuccess("")}
          onSuccess={()=>setOnFail("")}
          requestTokenUrl="https://api.twitter.com/oauth/request_token"
        />
      </div>
    </>
  );
};

export default Dashboard;
