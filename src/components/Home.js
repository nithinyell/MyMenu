import React, { useEffect, useState } from "react";
import {addDoc, doc, updateDoc, deleteDoc, collection, onSnapshot, getDoc} from 'firebase/firestore'
import {projectFirestore} from '../firebase/Config'
import Promotions from "./Promotions";
import save from '../images/save.png'
import delet from '../images/delet.png'
import logo from '../images/D4Logo.png'
import edit from '../images/edit.png'

function Home() {
    const [menu, setMenu] = useState([]);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);

    const menuCollectionRef = collection(projectFirestore, "menu")

    useEffect(() => {
      fetchItems()
    })

    const fetchItems = async() => {
        onSnapshot(menuCollectionRef, (snaps) => {
            setMenu(snaps.docs.map((doc) => ({...doc.data(), id: doc.id})))
        })
    }

    const createItem = async() => {
        if (title.length > 0 && price.length > 0) {
            await addDoc(menuCollectionRef, {title, price})
        }
    }

    const deleteItem = async(id) => {
        let menuDoc = doc(projectFirestore, "menu", id)
        await deleteDoc(menuDoc)
    }

    const updateitem = async(id, title, price) => {
        let menuDoc = doc(projectFirestore, "menu", id)
        await updateDoc(menuDoc, {title, price})
    }

    return (<div style={{ padding: 20 }}>
        <div style={{}}>
            <div>
                <div className="App-header">
                    <h1 className="font-link">Order Your Favourite Food</h1>
                    <img src={logo} alt="Logo" style={{ height: 100, width: 100 }} />
                </div>
            </div>
            <div>
                <Promotions />
            </div>
        </div>
        <div style={{}}>
            <input placeholder="Title" onChange={(event) => { setTitle(event.target.value) }}></input>
            <input placeholder="Price" onChange={(event) => { setPrice(event.target.value) }}></input>
            <button><img src={save} style={{ height: 25, width: 25, padding: 0 }} alt="" onClick={createItem} /></button>
        </div>
        <div>
            {menu.map((m) => {
                return (
                    <div className="flex-direction-row" key={m.id}>
                        <h3 className="font-link menu-items-fontSize">
                            {m.title} - ${m.price}
                            <div>
                                <button src={edit} style={{ height: 25, width: 25, padding: 0 }} alt="" onClick={() => { updateitem(m.id) }}></button>
                                <button src={delet} style={{ height: 25, width: 25, padding: 0 }} alt="" onClick={() => { deleteItem(m.id) }}></button>
                            </div>
                        </h3>
                    </div>
                )
            })}
        </div>
    </div>)
}

export default Home;