import { useSelector } from "react-redux";
import { RootState } from "../services/redux/store";
import Avatar from "../component/Avatar";
import { dateFormat } from "../utils";
import Navbar from "../component/Navbar";
import { useVerifyCredentials } from "../services/APIs/verifyCredentials";

const Dashboard = () => {
  const myData = useSelector((state: RootState) => state?.user?.userData);
  const {data} = useVerifyCredentials();

  return (
    <>
      <div className="dashboard">
        <Navbar />
        <div className="dashboard__container">
          <div className="dashboard__container__profile">
            {/* If user has been authenticated, show card with minimal user data */}
            {myData?.photoUrl ? <Avatar picUrl={myData?.photoUrl} /> : null}

            <div className="dashboard__container__profile__fields">
              <span className="dashboard__container__profile__fields__label">
                User ID
              </span>
              <div>{myData?.userId}</div>
            </div>

            <div className="dashboard__container__profile__fields">
              <span className="dashboard__container__profile__fields__label">
                Display name
              </span>
              <div>{myData?.displayName}</div>
            </div>

            <div className="dashboard__container__profile__fields">
              <span className="dashboard__container__profile__fields__label">
                Screen name
              </span>
              <div>{myData?.screenName}</div>
            </div>

           {data ? <>
            <div className="dashboard__container__profile__fields">
              <span className="dashboard__container__profile__fields__label">
                Followers
              </span>
              <div>{data?.followers_count}</div>
            </div>

            <div className="dashboard__container__profile__fields">
              <span className="dashboard__container__profile__fields__label">
                Following
              </span>
              <div>{data?.friends_count}</div>
            </div>
            </>: null}

            <div className="dashboard__container__profile__fields">
              <span className="dashboard__container__profile__fields__label">
                Last login
              </span>
              <div>{dateFormat(myData?.lastLogin)} </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
