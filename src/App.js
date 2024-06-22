//Importing the dependencies
import './App.css';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Orders from './pages/Orders';
import SignIn from "./pages/SigninPage";
import SignUp from "./pages/SignupPage";
import { createBrowserRouter , RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Page404 from './pages/Page404';
import { useDispatch, useSelector } from 'react-redux';
import { authaction,authSelector } from './reducers/authReducer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebaseInit';
import { useEffect } from 'react';
import { setItemsAsync } from './reducers/itemReducer';
import { collection, onSnapshot } from 'firebase/firestore';

//Component so that no one can go to the routes without authorization
const Protected1 = ({children}) => {
  const { user } = useSelector(authSelector);

  if(user){
    return <>{children}</>
  }else{
    return <><Page404 /></>
  }
}

//Creating the routes
const router = createBrowserRouter([
  {path: "/" , element: <Navbar />,  errorElement: <Page404 /> ,children: [
    {index: true, element: <Home />},
    {path: "sign-in", element: <SignIn />},
    {path: "sign-up", element:<SignUp /> },
    {path: "cart", element:<Protected1><Cart /></Protected1>},
    {path: "orders", element: <Protected1><Orders /></Protected1>}
  ]}
])


export default function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    function fetch(){
        dispatch(authaction.setLoading(true))
        onSnapshot(collection(db, "auth"), (snapShot) => {
            const users = snapShot.docs.map((doc) => {
                return{
                    id: doc.id,
                    ...doc.data()
                }
            })
            onAuthStateChanged(auth, (user) => {
                if(user){
                    dispatch(authaction.setUser(user.toJSON()));
                    const index = users.findIndex((data) => data.id === user.uid);
                    dispatch(authaction.setCartedItems(users[index].cartedItems));
                    dispatch(authaction.setOrderedItems(users[index].orderedItems))
                }
            })
        })
        dispatch(setItemsAsync("All"));
        dispatch(authaction.setLoading(false))
        }
        fetch();
  }, [dispatch])

  return (
    <div className="App">
      {/* Toast Container for notification */}
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}