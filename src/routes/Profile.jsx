import React, { useContext, useEffect } from "react";
import { authService, dbService } from "../common/firebase";
import { UserAuth } from "../App";

const Profile = () => {
  const userAuth = useContext(UserAuth);

  const onLogOutBtn = () => authService.signOut();

  const getOwner = async () => {
    const getOwner = await dbService
      .collection("send Message")
      .where("creatorId", "==", userAuth.uid)
      .orderBy("createAt")
      .get();

    console.log(
      "adsf",
      getOwner.docs.map((item) => item.data())
    );
  };

  useEffect(() => {
    getOwner();
  }, []);

  return <button onClick={onLogOutBtn}>Log Out</button>;
};

export default Profile;
