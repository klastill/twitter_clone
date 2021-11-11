
import { authService } from "fbase";
import { useHistory } from "react-router-dom";
import React from "react";

const Profile = () => {
  const history = useHistory();
  const onSignOutClick = () => {
    authService.signOut();
    history.push("/");
  };
return (
  <div>
    <button onClick={onSignOutClick}>Sign Out</button>
  </div>
);
}
export default Profile;