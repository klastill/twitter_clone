import { collection, getDocs, query, where } from "@firebase/firestore";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import { updateProfile } from "@firebase/auth";

const Profile = ({userObj, refreshUser}) => {
  const history = useHistory();
  const [newDisplyName, setNewDisplayName] = useState(userObj.displayName);
  const onSignOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyTweets = async () => {
    const q = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };
  const onChange = (event) => {
    const {target: {value}} = event;
    setNewDisplayName(value);
  };
  const onSubmit = async(event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplyName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplyName,
      });
      refreshUser();
    }
  }

  useEffect(() => {
    getMyTweets();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Display name" onChange={onChange} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onSignOutClick}>Sign Out</button>
    </>
  );
}
export default Profile;