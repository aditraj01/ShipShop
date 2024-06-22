//Importing the dependencies
import React, { useEffect } from 'react'
import styles from "../styles/Cart.module.css"
import ItemCard from '../components/ItemCard'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector, authaction } from '../reducers/authReducer'
import { itemSelector, itemaction } from '../reducers/itemReducer'
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseInit";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

const Cart = () => {

  const { cartedItems, user, orderedItems } = useSelector(authSelector);
  const { total } = useSelector(itemSelector);
  const dispatch = useDispatch()
  const navigate = useNavigate(); 

  useEffect(() => {
    dispatch(itemaction.setIsInCart(true));
  }, [dispatch])

 
  //Calculating the total price of the carted product
  useEffect(() => {
    if(cartedItems){
      const grandTotal = cartedItems.reduce((total, currentValue) => {
        return total + (currentValue.price * currentValue.quantity)
      },0);
    dispatch(itemaction.setTotal(grandTotal))
  }
  })
  //Handling the Order
  const handleOrder = () => {
    if(user){
        const itemRef = doc(db, 'auth', user.uid);
        updateDoc(itemRef,{
            orderedItems: arrayUnion({orders: cartedItems, total: total, date: new Date().toLocaleDateString()})
        })
        dispatch(authaction.setOrderedItems([
          ...orderedItems,
          {orders: cartedItems, total: total, date: new Date().toLocaleDateString()}
        ]))
        dispatch(itemaction.setTotal(0))
        updateDoc(itemRef,{
            cartedItems: []
        })
        toast.success("Item Purchased");
        dispatch(itemaction.setIsInCart(false))
        navigate("/orders");
    }
}

  const length = cartedItems.length;
  
  return (
    <>
     {length === 0 ? <h1>Cart is Empty!!!</h1> : <div className={styles.cartContainer}>
    <aside className={styles.aside}>
        <p>Total Price: $ {total.toFixed(2)} </p>
        <button className={styles.orderBtn} onClick={handleOrder} >Order</button>
    </aside>
    <div className={styles.listContainer}>
    {cartedItems.map((item) => {
                return(
                  <ItemCard id= {item.id} name={item.title} description={item.description} qty = {item.quantity} img={item.image} price={item.price} key={item.id} />
                );
            })}
    </div>
    </div>}
    </>
  )
}
export default Cart