import { useState, useEffect, createContext } from "react";
import AppRouter from "./AppRouter";
import { authService } from "./common/firebase";

export const UserAuth = createContext(null);

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAuth, setUserAuth] = useState();

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserAuth(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <UserAuth.Provider value={userAuth}>
          <AppRouter isLoggedIn={isLoggedIn} />
        </UserAuth.Provider>
      ) : (
        "inital...."
      )}
    </>
  );
}

export default App;
