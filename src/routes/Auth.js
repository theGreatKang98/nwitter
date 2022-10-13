import {getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, GithubAuthProvider,GoogleAuthProvider}  from "fbase";
import React, { useState } from "react";

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
        try{
            if(newAccount){
                 await createUserWithEmailAndPassword(
                    auth, email, password
                )
            } else {
                 await signInWithEmailAndPassword(auth, email, password);
            }
        } catch(error){
            setError(error.message);
        }
    }
    const toggleAccount = ()=>{
        setNewAccount((prev) => !prev)
    }
    const onSocialClick =async (event)=>{
        const {target:{name},} = event;
        let provider;
        console.log(getAuth());
        if(name === 'google'){
            provider = new GoogleAuthProvider();
        } else if(name === 'github'){
            provider = new GithubAuthProvider();
        }
        await signInWithPopup(getAuth(),provider);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange} />
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
                <input type="submit" value={newAccount ?  "Create Account" : "Sign In"} />
                <span>{error}</span>
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with Github</button>

            </div>
        </div>)
}
export default Auth;