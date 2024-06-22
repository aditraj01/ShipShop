//importing all the required components
import styles from "../styles/Filter.module.css";
import { useDispatch, useSelector } from "react-redux";
import { itemSelector } from "../reducers/itemReducer";
import { itemaction } from "../reducers/itemReducer";
import { setItemsAsync } from "../reducers/itemReducer";

export default function Filter(){

    //Importing the data 
    const { price } = useSelector(itemSelector);
    const dispatch = useDispatch();
    
    return(
        <>
            <h2>Filter</h2>
            <form>
                <label htmlFor = "price">Price: $ {price} </label>
                <input type="range" id="price" name="price" min="1" max="1000" defaultValue="300" onChange={(e) => dispatch(itemaction.changePrice(e.target.value)) } className={styles.range} />
                <h2>Category</h2>
                <div className={styles.categoriesContainer}>
                    <span to="/" className={styles.categories} onClick={() => dispatch(setItemsAsync("All"))}>
                        All
                    </span>
                    <span to="/" className={styles.categories} onClick={() => dispatch(setItemsAsync("men's clothing"))} >
                        Men's Clothings
                    </span>
                    <span to="/" className={styles.categories} onClick={() => dispatch(setItemsAsync("women's clothing"))} >
                        Women's Clothings
                    </span>
                    <span to="/" className={styles.categories} onClick={() => dispatch(setItemsAsync("jewelery"))} >
                        Jewelery
                    </span>
                    <span to="/" className={styles.categories} onClick={() => dispatch(setItemsAsync("electronics"))} >
                        Electronics
                    </span>
                </div>
            </form>
        </>
    );
}