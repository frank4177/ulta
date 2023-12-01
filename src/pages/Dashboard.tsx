import {useState} from "react";
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';


const Dashboard = () => {
  const [ setOnFail] = useState<any>()
  const [ setIsSuccess] = useState<any>()
  return (
    <>
      <div className="dashboard">
        <TwitterLogin
          loginUrl="https://ulta-nine.vercel.app/"
          onFailure={setIsSuccess}
          onSuccess={setOnFail}
          requestTokenUrl="https://ulta-nine.vercel.app/auth/twitter/redirect"
        />
      </div>
    </>
  );
};

export default Dashboard;
