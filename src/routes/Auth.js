import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GithubAuthProvider,
  GoogleAuthProvider, 
  signInWithPopup, 
} from "@firebase/auth";
import { authService } from "fbase";
import React, { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event) => {
    const {target: {name, value}} = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        await createUserWithEmailAndPassword(authService, email, password);
      } else {
        await signInWithEmailAndPassword(authService, email, password);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };
  const onSocialClick = async (event) => {
    const {target: {name}} = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(authService, provider);
  }

  return (
    <div>
      <form onSubmit={onSubmit} >
        <input name="email" type="email" placeholder="Email" value={email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" value={password} onChange={onChange} required />
        <input type="submit" value={newAccount ? "Create Account" : "Sign In"}/>
      </form>
      {error}
      <div onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</div>
      <div>
        <button name="google" onClick={onSocialClick}>Continue with Google</button>
        <button name="github" onClick={onSocialClick}>Continue with Github</button>
      </div>
    </div>
  );
};

export default Auth;
