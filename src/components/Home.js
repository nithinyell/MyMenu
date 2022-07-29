import React, { useEffect, useState } from "react";
import {addDoc, collection, onSnapshot} from 'firebase/firestore'
import {projectFirestore} from '../firebase/Config'
import Promotions from "./Promotions";

function Home() {
    const [menu, setMenu] = useState([]);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);

    const menuCollectionRef = collection(projectFirestore, "menu")

    useEffect(() => {
      const getUsers = async () => {
        onSnapshot(menuCollectionRef, (snaps) => {
            setMenu(snaps.docs.map((doc) => ({...doc.data(), id: doc.id})))
        })
      }
      getUsers()
    })

    const createItem = async() => {
        if (title.length > 0 && price.length > 0) {
            await addDoc(menuCollectionRef, {title, price})
        }
    }

    return (<div className="Home">
        <div>
            <h1 className="font-link">Arya - Order Your Favourite Food</h1>
            <Promotions />
        </div>
        <div>
            <input placeholder="Title" onChange={(event) => { setTitle(event.target.value) }}></input>
            <input placeholder="Price" onChange={(event) => { setPrice(event.target.value) }}></input>
            <button onClick={createItem}>Submit</button>
        </div>    
        <div>
            {menu.map((m) => {
                return (
                    <div className="menu-page" key={m.id}>
                        <h1 className="font-link">
                            {m.title} - ${m.price}
                        </h1>
                    </div>
                )
            })}
        </div>
    </div>)
}

export default Home;