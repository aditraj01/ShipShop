// Importing all the components and context 
import { NavLink, Outlet } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { itemaction } from "../reducers/itemReducer";
import { authSelector, logout } from "../reducers/authReducer";
import { auth } from "../firebaseInit";
import { signOut } from "firebase/auth";

export default function Navbar(){
    const dispatch = useDispatch();
    const {user} = useSelector(authSelector);
    return(
        <>
    <div className={styles.container}>
        <div className={styles.logo}><NavLink to= "/" onClick={() => dispatch(itemaction.setIsInCart(false))}><h3>ShipShop</h3></NavLink></div>
        <div className={styles.navMenu}>
            {/* Moving to Home Page */}
            <NavLink to = "/" className={styles.link} onClick={() => dispatch(itemaction.setIsInCart(false))}>
                <img src="https://cdn-icons-png.flaticon.com/128/553/553416.png" className={styles.iconStyle} alt="home" />
                Home
            </NavLink>
             {/* Moving to Cart Page if the user is logged in */}
            {user && <NavLink to={'/cart'} className={styles.link} onClick={() => dispatch(itemaction.setIsInCart(true))}>
                <img src="https://cdn-icons-png.flaticon.com/128/891/891462.png" className={styles.iconStyle} alt="cart" />
                Cart
            </NavLink>}
             {/* Moving to Orders Page if the user is logged in*/}
            {user && <NavLink to={"/orders"} className={styles.link} onClick={() => dispatch(itemaction.setIsInCart(false))}>
                <img src="https://cdn-icons-png.flaticon.com/128/6815/6815043.png" className={styles.iconStyle} alt="Orders" />
                My Orders
            </NavLink>}
            {/* Sign In or Sign out button depending if the user is logged in or not */}
            
               {user ? <NavLink className={styles.link} style={{cursor: "pointer", color:"#551a8b"}} onClick={() => {
                dispatch(itemaction.setIsInCart(false)); dispatch(logout({auth, signOut}))}}>
                    <img src="https://cdn-icons-png.flaticon.com/128/6785/6785377.png" className={styles.iconStyle} alt="Sign Out"/>
                    Sign Out
               </NavLink>
               :
              <NavLink to= "/sign-in" className={styles.link} onClick={() => dispatch(itemaction.setIsInCart(false))}>
                <img src="https://cdn-icons-png.flaticon.com/128/1646/1646830.png" alt="Sign In" className={styles.iconStyle}/>
                Sign In
              </NavLink>
              }
        </div>
    </div>
    <Outlet />
    </>
    );
}