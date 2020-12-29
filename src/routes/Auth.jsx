import { useState } from "react";
import { authService } from "common/firebase";
import firebase from "firebase";

const Auth = () => {
  const [email, setEamil] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEamil(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!newAccount) {
        await authService.createUserWithEmailAndPassword(email, password);
      } else {
        await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      alert(error);
      return;
    }
  };

  const onToggleAccount = async () => {
    setNewAccount((prev) => !prev);
  };

  const onSocial = async (e) => {
    const {
      target: { name },
    } = e;

    let provider;
    if (name === "google") provider = new firebase.auth.GoogleAuthProvider();
    if (name === "github") provider = new firebase.auth.GithubAuthProvider();

    await authService.signInWithPopup(provider);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          required
          type="text"
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChange}
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          value={password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? "Sign In.." : "Create Account!"}
        />
      </form>
      <span onClick={onToggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>

      <div>
        <button onClick={onSocial} name="google">
          Google Login..
        </button>
        <button onClick={onSocial} name="github">
          github Login..
        </button>
      </div>
    </>
  );
};

export default Auth;
