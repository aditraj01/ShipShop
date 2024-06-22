//Importing the dependencies
import React from 'react';
import styles from "../styles/Orders.module.css";
import { useSelector } from 'react-redux';
import { authSelector } from '../reducers/authReducer';

//Table for Order
const OrderTable = ({orderedItems, total, date}) => {
  return (
    <div className={styles.table}>
      <h2>Ordered On : {date} </h2>
      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
        {orderedItems.map((item) => {
          return (
            <tr key={item.id}>
              <td>{item.title.slice(0, 19)}...</td>
              <td>$ {item.price}</td>
              <td>{item.quantity}</td>
              <td>$ {item.price * item.quantity}</td>
            </tr>
          );
        })}
        <tr className={styles.totalprice}>
          <td>
          $ {total}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  );

}

const Orders = () => {

  const { orderedItems } = useSelector(authSelector);

  return (
    <div>
    <h1 className={styles.header}>Your Orders</h1>
    {orderedItems.map((orders, id) => 
        <OrderTable key={id} orderedItems={orders.orders} total={orders.total} date={orders.date} />
        )
      }
    </div>
  )
}
export default Orders