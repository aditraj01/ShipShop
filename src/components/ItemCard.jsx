//importing all the required components
import  styles  from "../styles/ItemCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { itemSelector, itemaction } from "../reducers/itemReducer";
import { authSelector, authaction } from "../reducers/authReducer";
import { db } from "../firebaseInit";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function ItemCard({img, name, price, id, qty}){
    const title = name.slice(0, 22);
    const { isInCart, items,total } = useSelector(itemSelector);
    const { cartedItems, user } = useSelector(authSelector);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    //Handling the adding of data in cart
    const addItemToCart = async (id) => {
        if(user){
            const index = cartedItems.findIndex((item) => item.id === id);
            const itemIndex = items.findIndex((item) => item.id === id);
            const itemRef = doc(db, 'auth', user.uid);
            if(index === -1){
                const data = {
                    id: id,
                    title: items[itemIndex].title,
                    price: items[itemIndex].price,
                    image: items[itemIndex].image,
                    quantity: 1
                }
                dispatch(authaction.setCartedItems(
                    [...cartedItems,
                        data
                    ]
                ))
                dispatch(itemaction.setTotal(total + items[itemIndex].price));
                updateDoc(itemRef,{
                    cartedItems:arrayUnion(data)
                });
                toast.success("Item added to Cart");
            }else{
                const oldData = {
                    id: id,
                    title: cartedItems[index].title,
                    price: cartedItems[index].price,
                    image: cartedItems[index].image,
                    quantity: cartedItems[index].quantity
                }
                const newData = {
                    id: id,
                    title: cartedItems[index].title,
                    price: cartedItems[index].price,
                    image: cartedItems[index].image,
                    quantity: cartedItems[index].quantity + 1 
                }

                let cartItems = cartedItems.map((item) => ({...item}));
                
                cartItems[index].quantity += 1;
                dispatch(authaction.setCartedItems(cartItems)); 

                updateDoc(itemRef,{
                    cartedItems:arrayRemove(oldData)
                });
                 updateDoc(itemRef,{
                    cartedItems:arrayUnion(newData)
                });
                
                toast.success("Item count Increase");
            }
        }else{
            toast.error("Sign in/Sign Up to use this function")
            navigate("/sign-in")
        }
    }

    //Removing items from cart
    const removeFromCart = (id) => {
        if(user){
            const itemRef = doc(db, 'auth', user.uid);
            let cartItems = cartedItems.map((item) => ({...item}));
            const index = cartedItems.findIndex((item) => item.id === id);
            const oldData = {
                id: id,
                title: cartedItems[index].title,
                price: cartedItems[index].price,
                image: cartedItems[index].image,
                quantity: cartedItems[index].quantity
            }
            updateDoc(itemRef,{
                cartedItems:arrayRemove(oldData)
            });
            cartItems.filter((item) => item.id === id);
            dispatch(authaction.setCartedItems(cartItems));
            toast.success("Item removed from Cart");
        }
    }
    // Icreasing the quantity of item
    const handleIncrease = (id) => {
        if(user){
            const cartItems = cartedItems.map((item) => ({...item}));
            const index = cartItems.findIndex((item) => item.id === id);
            const itemRef = doc(db, 'auth', user.uid);
            const oldData = {
                id: id,
                title: cartedItems[index].title,
                price: cartedItems[index].price,
                image: cartedItems[index].image,
                quantity: cartedItems[index].quantity
            }
            const newData = {
                id: id,
                title: cartedItems[index].title,
                price: cartedItems[index].price,
                image: cartedItems[index].image,
                quantity: cartedItems[index].quantity + 1 
            }
            updateDoc(itemRef,{
                cartedItems:arrayRemove(oldData)
            });
            updateDoc(itemRef,{
                cartedItems:arrayUnion(newData)
            });
            cartItems[index].quantity += 1;
            dispatch(authaction.setCartedItems(cartItems)); 
            dispatch(itemaction.setTotal(total + cartedItems[index].price));
        }
    }
    //Decreasing the quantity of item
    const handleDecrease = (id) => {
        const cartItems = cartedItems.map((item) => ({...item}));
            const index = cartItems.findIndex((item) => item.id === id);
            const itemRef = doc(db, 'auth', user.uid);
            const oldData = {
                id: id,
                title: cartedItems[index].title,
                price: cartedItems[index].price,
                image: cartedItems[index].image,
                quantity: cartedItems[index].quantity
            }
            if(cartItems[index].quantity === 1){
                updateDoc(itemRef,{
                    cartedItems:arrayRemove(oldData)
                });
            }else{
                const newData = {
                    id: id,
                    title: cartedItems[index].title,
                    price: cartedItems[index].price,
                    image: cartedItems[index].image,
                    quantity: cartedItems[index].quantity - 1 
                }
                updateDoc(itemRef,{
                    cartedItems:arrayRemove(oldData)
                });
                updateDoc(itemRef,{
                    cartedItems:arrayUnion(newData)
                });
            }
            cartItems[index].quantity -= 1;
            dispatch(authaction.setCartedItems(cartItems)); 
            dispatch(itemaction.setTotal(total - cartItems[index].price));
    }


    return(
        <>
            <div className={styles.itemContainer}>
                <div className={styles.imgContainer}>
                    <img src={img} alt="Item" className={styles.img} />
                </div>
                <div className={styles.itemDetails}>
                <div className={styles.itemName}>{title}...</div>
                <div className={styles.itemPrice}>$ {price}</div>
                { isInCart && 
                    <div className={styles.qtyCtn}>
                        <img className={styles.icon}
                            // Decreasing the quantity of the desired product
                            alt="Decrease" 
                            src="https://cdn-icons-png.flaticon.com/128/860/860821.png"
                            onClick={() => handleDecrease(id)}
                        />
                        <span className={styles.qty}>{qty}</span>
                        <img className={styles.icon}
                            // Incresing the quantity of the desired product
                            alt="increase" 
                            src="https://cdn-icons-png.flaticon.com/128/2997/2997933.png"
                            onClick={() => handleIncrease(id)}
                        />
                    </div>
                }
                {/* Rendering the "Removing from Cart" and "Add to cart" using Ternary Operator */}
                { isInCart ? 
                    <button className={styles.removeButton} onClick={() => removeFromCart(id)}>Remove from Cart</button>
                    :
                    <button className={styles.itemButton} onClick={() => addItemToCart(id)}>Add to Cart</button>}
                </div>
            </div>
        </>
    );
}