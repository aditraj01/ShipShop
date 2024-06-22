//Importing the dependencies
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/LoginPage.module.css";
import { authenticateUser } from "../reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebaseInit";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { authSelector, authaction } from "../reducers/authReducer";
//import { unwrapResult, unwrap } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { db } from "../firebaseInit";
import { onSnapshot, collection } from "firebase/firestore";
import Loader from "../components/Loader";

export default function SignIn(){

    const { username, password, loading } = useSelector(authSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    //Handling the Login Functioon
    const login = async (e) => {
        e.preventDefault();
        try{
        await dispatch(authenticateUser({signInWithEmailAndPassword, auth, username, password})).unwrap()
        onSnapshot(collection(db, "auth"), (snapShot) => {
            const users = snapShot.docs.map((doc) => {
                return{
                    id: doc.id,
                    ...doc.data()
                }
            })
            onAuthStateChanged(auth, (user) => {
                if(user){
                  const index = users.findIndex((data) => data.id === user.uid);
                  dispatch(authaction.setCartedItems(users[index].cartedItems));
                  dispatch(authaction.setOrderedItems(users[index].orderedItems))
                }
              })
        })
    
            navigate("/");
            toast.success("User Logged In!!");
    }catch(err){
        toast.error("User not found!!!");
    }
}
    if(loading) {
        return <><Loader /></>
    }

    return(
        <>
            <form className={styles.form} onSubmit={login}>
                <h1 className={styles.title}>Sign In</h1>
                <input type="email" className={styles.input} value={username} onChange={(e) => dispatch(authaction.setUsername(e.target.value))} placeholder="Enter Email" required></input>
                <input type="password"className={styles.input} value={password} onChange={(e) => dispatch(authaction.setPassword(e.target.value))} placeholder="Enter Password" required></input>
                <button className={styles.button} type="Submit">Sign In</button>
                <NavLink to = "/sign-up" ><p className={styles.signUp}>Go to Sign-Up Page</p></NavLink>
            </form>
        </>
    );
}