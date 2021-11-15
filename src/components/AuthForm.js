import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";
import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
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

  return (
    <>
      <form onSubmit={onSubmit} className="container" >
        <input name="email" type="email" placeholder="Email" value={email} onChange={onChange} required className="authInput" />
        <input name="password" type="password" placeholder="Password" value={password} onChange={onChange} required className="authInput" />
        <input type="submit" value={newAccount ? "Create Account" : "Sign In"} className="authInput authSubmit" />
      </form>
      {error && <span className="authError">{error}</span>}
      <div onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</div>
    </>
  );
}

export default AuthForm;