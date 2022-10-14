import { getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider } from "fbase";
import React, { useState } from "react";
import { Button } from "bootstrap";

const Auth = () => {
    const auth = getAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState('');
    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            if (newAccount) {
                await createUserWithEmailAndPassword(
                    auth, email, password
                )
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            setError(error.message);
        }
    }
    const toggleAccount = () => {
        setNewAccount((prev) => !prev)
    }
    const onSocialClick = async (event) => {
        const { target: { name }, } = event;
        let provider;
        console.log(getAuth());
        if (name === 'google') {
            provider = new GoogleAuthProvider();
        } else if (name === 'github') {
            provider = new GithubAuthProvider();
        }
        await signInWithPopup(getAuth(), provider);
    }

    return (
        <div className="container col-6 ">
            <form onSubmit={onSubmit}>
                <div className="form-group">
                <label for="emailInput">Email address</label>
                    <input id="emailInput" className="form-control" name="email" type="text" placeholder="Email" required value={email} onChange={onChange} />
                </div>
                <div className="form-group">
                <label for="passwordInput">password</label>
                    <input id="passwordInput" className="form-control" name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
                </div>
                <input className="btn btn-primary w-100" type="submit" value={newAccount ? "Create Account" : "Sign In"} />
                <span>{error}</span>
            </form>

            <button className="btn d-block m-auto" onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</button>
            <div className="d-flex justify-content-center">
                <button className="btn btn-outline-info" onClick={onSocialClick} name="google">Continue with Google</button>
                {/* <Button onClick={onSocialClick} name="google">Continue with Google</Button> */}
                <button className="btn btn-outline-dark" onClick={onSocialClick} name="github">Continue with Github</button>
            </div>
        </div>)
}
export default Auth;