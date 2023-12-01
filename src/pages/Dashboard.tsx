import {useState} from "react";
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';


const Dashboard = () => {
  const [ setOnFail] = useState<any>()
  const [ setIsSuccess] = useState<any>()
  return (
    <>
      <div className="dashboard">
        <TwitterLogin
          loginUrl="http://localhost:4000//api/v1.1/auth/twitter"
          onFailure={setIsSuccess}
          onSuccess={setOnFail}
          requestTokenUrl="http://localhost:4000/auth/twitter/uta"
        />
      </div>
    </>
  );
};

export default Dashboard;
