//Importing the dependencies
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/LoginPage.module.css";
import { authSelector, authaction, signUpAsync } from "../reducers/authReducer";
import { useNavigate } from "react-router-dom";
import {auth, db} from "../firebaseInit";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {doc, setDoc } from "firebase/firestore";
import Loader from "../components/Loader";

export default function SignUp(){
    //Fetching the values
    const { username, password, name, loading } = useSelector(authSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    //Handling the SignUp function
    const SignUp = async (e) => {
        e.preventDefault();
        try{
            await dispatch(signUpAsync({auth, username, name, password, createUserWithEmailAndPassword, updateProfile, db ,setDoc, doc})).unwrap();
            navigate("/");
            toast.success("Account Successfully Created");
        }catch(err){
            toast.error(`${err.code}`);
        }
    }

    if(loading){
        return <><Loader /></>
    }

    return(
        <>
            <form className={styles.form} onSubmit={SignUp}>
                <h1 className={styles.title}>Sign Up</h1>
                <input type="text" className={styles.input} value={name} placeholder="Enter Name" required onChange={(e) => dispatch(authaction.setName(e.target.value))}></input>
                <input type="email" className={styles.input} value={username} placeholder="Enter Email" onChange={(e) => dispatch(authaction.setUsername(e.target.value))} required></input>
                <input type="password"className={styles.input} value={password} placeholder="Enter Password" onChange={(e) => dispatch(authaction.setPassword(e.target.value))} required></input>
                <button type="Submit" className={styles.button}>Sign Up</button>
            </form>
        </>
    );
}