import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	ActionIcon,
	Switch,
	Autocomplete
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { Edit, MoonStars, Sun, Trash } from 'tabler-icons-react';

import {
	MantineProvider,
	ColorSchemeProvider,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import {addDoc, doc, updateDoc, deleteDoc, collection, onSnapshot, query, orderBy, where} from 'firebase/firestore'
import {projectFirestore} from '../firebase/Config'

export default function Home() {
	const [menu, setMenu] = useState([]);
    	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
    	const [price, setPrice] = useState("");
	const [id, SetId] = useState(0)
	const [update, setUpdate] = useState(false);
	const [opened, setOpened] = useState(false);
	const [itemAvailable, setItemAvailable] = useState(true);
	const [data, setData] = useState([]);
	let categoryName = "";

	const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});

	const toggleColorScheme = value =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useHotkeys([['mod+J', () => toggleColorScheme()]]);

	const itemTitle = useRef('');
	const itemCategory = useRef('');
	const itemPrice = useRef('');

    const menuMainCollectionRef = collection(projectFirestore, "menu")
    const menuCollectionRef = query(menuMainCollectionRef, orderBy("category", "desc"))
    const menuCategoryRef = query(menuMainCollectionRef, where("category", "!=", ""));

    const fetchItems = async() => {
        onSnapshot(menuCollectionRef, (snaps) => {
            setMenu(snaps.docs.map((doc) => ({...doc.data(), id: doc.id})))
        })
	onSnapshot(menuCategoryRef, (snaps) => {
		setData(snaps.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
	})
    }
    
    let pp = data.filter((ele, ind) => ind === data.findIndex(elem => elem.category === ele.category))
    const categoryNames = (pp.map(function (d) {
	return d.category;
    }))

    const createItem = async() => {
        if (title.length > 0 && price.length > 0) {
            await addDoc(menuMainCollectionRef, { title, category, price, itemAvailable })
        }
    }

    const deleteItem = async(id) => {
        let menuDoc = doc(projectFirestore, "menu", id)
        await deleteDoc(menuDoc)
    }

    const updateitem = async() => {
		if (title.length > 0 && price.length > 0 && id.length > 0) { 
			let menuDoc = doc(projectFirestore, "menu", id)
			await updateDoc(menuDoc, { title, category, price, itemAvailable })
		}
    }

	const updateItemAvailability = async(id, itemAvailable) => {
		let menuDoc = doc(projectFirestore, "menu", id)
		await updateDoc(menuDoc, {itemAvailable})
	}

	useEffect(() => {
		fetchItems()
	}, []);

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}>
			<MantineProvider
				theme={{ colorScheme, defaultRadius: 'md' }}
				withGlobalStyles
				withNormalizeCSS>
				<div className='App'>
					<Modal
						opened={opened}
						size={'md'}
						title={'New Item'}
						withCloseButton={false}
						onClose={() => {
							setOpened(false);
						}}
						centered>
						<TextInput
							mt={'md'}
							ref={itemTitle}
							placeholder={'Item Title'}
							required
							label={'Title'}
							onChange={(event) => { setTitle(event.target.value) }}
							error={update ? title : ''}
							variant={'filled'}
						/>
						<Autocomplete
							mt={'md'}
							placeholder="Select or Create Category"
							label="Category"
							withAsterisk
							ref={itemCategory}
							data={categoryNames}
							value={category}
							onChange={setCategory}
							error={update ? category : ''}
							variant={'filled'}
						/>
						<TextInput
							ref={itemPrice}
							mt={'md'}
							required
							placeholder={'Price'}
							label={'Price'}
							onChange={(event) => { setPrice(event.target.value) }}
							error={update ? price : ''}
							variant={'filled'}
						/>
						<Group mt={'md'} position={'apart'}>
							<Button
								onClick={() => {
									setOpened(false);
								}}
								variant={'subtle'}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									update ? updateitem() : createItem()
									setOpened(false);
								}}>
								{update ? "Update" : "Create"} Item
							</Button>
						</Group>
					</Modal>
					<Container size={550} my={50}>
						<Group position={'apart'} style={{ marginBottom: "20px" }}>
							<Title
								sx={theme => ({
									fontFamily: `Greycliff CF, ${theme.fontFamily}`,
									fontWeight: 900,
								})}>
								My Menu🍴🍛
							</Title>
							<ActionIcon
								color={'blue'}
								onClick={() => toggleColorScheme()}
								size='lg'>
								{colorScheme === 'dark' ? (
									<Sun size={16} />
								) : (
									<MoonStars size={16} />
								)}
							</ActionIcon>
						</Group>
						{menu.length > 0 ? (
							menu.map((m, index) => {
								if (m.title) {
									return (
										<>{index === 0 ? <Group>
											<Text weight={'bold'} style={{ width: "100%", textAlign: "left", fontSize: "18px", textDecoration: "underline", marginTop: "15px" }}>{m.category}<span style={{ display : "none" }}>{categoryName=m.category}</span></Text>
										</Group> : [
											categoryName === m.category ? null : <Group>
											<Text weight={'bold'} style={{ width: "100%", textAlign: "left", fontSize: "18px", textDecoration: "underline", marginTop: "15px" }}>{m.category}<span style={{ display : "none" }}>{categoryName=m.category}</span></Text>
										</Group>]} <Group position={'apart'}>
											<Group position={'apart'} style={{ width: "55%", marginLeft: "20px" }}>
												<Text style={m.itemAvailable ? null : { textDecorationLine: 'line-through' }} weight={'bold'}>{m.title}</Text>
												<Text style={m.itemAvailable ? null : { textDecorationLine: 'line-through' }} weight={'bold'} color={'dimmed'} size={'md'}>
													₹{m.price}
												</Text>
											</Group>
											<Group position={'center'} style={{ display: "contents" }}>
												<ActionIcon
													title="Edit Item"
													onClick={() => {
														setTitle(m.title)
														setCategory(m.category)
														setPrice(m.price)
														SetId(m.id)
														setUpdate(true)
														setOpened(true);
													}}
													color={colorScheme === 'dark' ? 'indigo' : 'dark'}
													variant={'transparent'}>
													<Edit />
												</ActionIcon>
												<ActionIcon
													title="Delete Item"
													onClick={() => {
														deleteItem(m.id);
													}}
													color={'red'}
													variant={'transparent'}>
													<Trash />
												</ActionIcon>
												<Switch
													checked={m.itemAvailable}
													title="Item Availability"
													onChange={(event) => {
														updateItemAvailability(m.id, event.currentTarget.checked)
														setItemAvailable(event.currentTarget.checked)
													}
													}
													color='green'
												/>
											</Group>
										</Group></>
									);
								} else {
									return null
								}
							})
						) : (
							<Text size={'lg'} mt={'md'} color={'dimmed'}>
								No Menu Items
							</Text>
						)}
						<Button
							onClick={() => {
								setTitle('')
								setCategory('')
								setPrice('')
								SetId('')
								setItemAvailable(true)
								setUpdate(false)
								setOpened(true);
							}}
							fullWidth
							mt={'md'}>
							Add New Item
						</Button>
					</Container>
				</div>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
