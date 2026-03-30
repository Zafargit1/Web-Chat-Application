import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => { 
    const [err, setErr] = useState(false);
    const navigate = useNavigate()
    // FIX 6: Added a loading state for better UX
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading indicator
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            signInWithEmailAndPassword(auth, email, password)
            navigate("/")
        } catch (err) {
            setErr(true);
            setLoading(false);
            }
    };
    
    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Zafar's Chat</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="email" />
                    <input type="password" placeholder="password" />
                    <button>Log in</button>
                </form>
                <p>You dom't have an account? <Link to="/register" >Register</Link></p>
                
                
            </div>
        </div>
    );
};

export default Login;