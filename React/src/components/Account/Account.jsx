import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccountQuery } from "./AccountSlice";

export default function Account({ loggedIn, setAdmin }) {
  const [user, setUser] = useState(null);
  const { data, isSuccess } = useAccountQuery();

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn && isSuccess && data) {
        setUser(data);
        console.log(user);
        if (user && user.isAdmin === true) {
          setAdmin(true);
        }
      }
    };

    fetchData();
  }, [data, isSuccess, loggedIn, setAdmin, user]);

  return <div>Account</div>;
}
