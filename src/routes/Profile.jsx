import { authService } from "../common/firebase";

const Profile = () => {
  const onLogOutBtn = () => authService.signOut();

  return <button onClick={onLogOutBtn}>Log Out</button>;
};

export default Profile;
