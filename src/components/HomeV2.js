import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	ActionIcon
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { Edit, MoonStars, Sun, Trash } from 'tabler-icons-react';

import {
	MantineProvider,
	ColorSchemeProvider,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import {addDoc, doc, updateDoc, deleteDoc, collection, onSnapshot} from 'firebase/firestore'
import {projectFirestore} from '../firebase/Config'

export default function App() {
	const [menu, setMenu] = useState([]);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
	const [id, SetId] = useState(0)
	const [update, setUpdate] = useState(false);
	const [opened, setOpened] = useState(false);
	const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});

	const toggleColorScheme = value =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useHotkeys([['mod+J', () => toggleColorScheme()]]);

	const itemTitle = useRef('');
	const itemPrice = useRef('');

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

    const updateitem = async() => {
		console.log("updateitem", title, price, id)
		if (title.length > 0 && price.length > 0 && id.length > 0) { 
			let menuDoc = doc(projectFirestore, "menu", id)
			await updateDoc(menuDoc, {title, price})
		}
    }

	useEffect(() => {
		fetchItems()
	});

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
						<Group position={'apart'}>
							<Title
								sx={theme => ({
									fontFamily: `Greycliff CF, ${theme.fontFamily}`,
									fontWeight: 900,
								})}>
								My Menu
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
							menu.map((m) => {
								if (m.title) {
									return (
										<Group position={'apart'}>
											<Group position={'apart'}>
												<Text weight={'bold'}>{m.title}</Text>
												<Text weight={'bold'} color={'dimmed'} size={'md'}>
													₹{m.price}
												</Text>
											</Group>
											<Group position={'center'}>
											<ActionIcon
												onClick={() => {
													setTitle(m.title)
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
												onClick={() => {
													deleteItem(m.id);
												}}
												color={'red'}
												variant={'transparent'}>
												<Trash />
											</ActionIcon>
											</Group>
										</Group>
									);
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
								setPrice('')
								SetId('')
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