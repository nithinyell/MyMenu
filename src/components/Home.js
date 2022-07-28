import React, { useEffect, useState } from "react";
import {addDoc, collection, getDocs} from 'firebase/firestore'
import {projectFirestore} from '../firebase/Config'
import { async } from "@firebase/util";

function Home() {
    const [menu, setMenu] = useState([]);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);

    const menuCollectionRef = collection(projectFirestore, "menu")

    useEffect(() => {
      const getUsers = async () => {
        const data = await getDocs(menuCollectionRef)
        console.log(data)
        setMenu(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
      }
      getUsers()
    }, [])

    const createItem = async() => {
        await addDoc(menuCollectionRef, {title, price})
    }

    return (<div className="Home">
        <input placeholder="Title" onChange={(event) => {setTitle(event.target.value)}}></input>
        <input placeholder="Price" onChange={(event) => {setPrice(event.target.value)}}></input>
        <button onClick={createItem}>Submit</button>

        {menu.map((m) => {
            return (
                <div>
                    {" "}
                    <h1>
                        Dish: {m.title}
                    </h1>
                    <h1>
                        Price: {m.price}
                    </h1>
                </div>
            )
        })}
    </div>)
}

export default Home;