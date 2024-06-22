//Importing the dependencies
import ItemCard from "../components/ItemCard";
import { useSelector } from "react-redux";
import { itemSelector } from "../reducers/itemReducer";

export default function ItemList(){
    
    const { items, price, search } = useSelector(itemSelector);

    return(
        <>
            {items.filter((item) => 
                search.toLowerCase() === '' ? item 
                : item.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => {
                return(
                    price > item.price && <ItemCard id= {item.id} name={item.title} img={item.image} price={item.price} key={item.id} />
                );
            })}
        </>
    );
}