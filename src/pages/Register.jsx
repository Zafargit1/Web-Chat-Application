import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase"; // i did not imported db
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate()
    // FIX 6: Added a loading state for better UX
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading indicator
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            // Register user with email and password
            const res = await createUserWithEmailAndPassword(auth, email, password);

            // FIX 4: Use UID instead of displayName to avoid overwriting files
            const storageRef = ref(storage, `avatars/${res.user.uid}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // FIX 2: Added 'state_changed' as the first argument for monitoring upload progress
            uploadTask.on(
                'state_changed', // Event name
                null, // Progress listener (optional, skipped)

                (error) => { // Error handler
                    setErr(true);
                    setLoading(false); // Stop loading
                },
                // Success handler
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        // Update user profile
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });
                        // FIX 3: Added user UID as the document ID
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });
                        
                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        navigate("/");
                        
                        setLoading(false)
                        
                    } catch (err) {
                        setErr(true);
                        setLoading(false); 
                       }
                }
            );
        } catch (err) {
            setErr(true);
            setLoading(false);
            }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Zafar's Chat</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Enter name" />
                    <input type="email" placeholder="email" />
                    <input type="password" placeholder="password" />
                    <input style={{ display: "none" }} type="file" id="file" />
                    <label htmlFor="file">
                        <img src={Add} alt="" />
                        <span>Add an avatar</span>
                    </label>

                    {/* FIX 6: Disable button and show loading text while processing */}
                    <button disabled={loading}>{loading ? "Signing up..." : "Sign up"}</button>
                    {err && <span>Something went wrong</span>}
                </form>
                <p>
                    You have an account? <Link to="/login" >Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;