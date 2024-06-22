//Importing the dependencies and Components
import Filter from '../components/Filter';
import ItemList from './Itemlist';
import styles from "../styles/Home.module.css"
import { useSelector, useDispatch } from 'react-redux';
import { itemSelector, itemaction } from '../reducers/itemReducer';
import Loader from "../components/Loader";
import { authSelector } from '../reducers/authReducer';


export default function Home(){

    const { isLoading } = useSelector(itemSelector);
    const { loading } = useSelector(authSelector);
    const dispatch = useDispatch();

    return(
        <> 
        {isLoading || loading ? <Loader /> : <div className={styles.homeContainer}>
            <aside className={styles.filter}>
                <Filter />
            </aside>
            <form className={styles.form}>
                <input type="search" placeholder="Search by name" onChange={(e) => dispatch(itemaction.setSearch(e.target.value))} className={styles.search}/>  
            </form>
            <div className={styles.listContainer}>
                <ItemList />
            </div>
        </div>}
       </>
    );
}