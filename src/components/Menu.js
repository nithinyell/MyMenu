import {
	Container,
	Text,
	Title,
	Group,
	ActionIcon
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { MoonStars, Sun } from 'tabler-icons-react';

import {
	MantineProvider,
	ColorSchemeProvider,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { projectFirestore } from '../firebase/Config'

export default function Home() {
	const [menu, setMenu] = useState([]);
	let categoryName = "";

	const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});

	const toggleColorScheme = value =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useHotkeys([['mod+J', () => toggleColorScheme()]]);

	const menuMainCollectionRef = collection(projectFirestore, "menu")
	const menuCollectionRef = query(menuMainCollectionRef, orderBy("category", "desc"))

	useEffect(() => {
		fetchItems()
	})

	const fetchItems = async () => {
		onSnapshot(menuCollectionRef, (snaps) => {
			setMenu(snaps.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		})
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
					<Container size={350} my={50}>
						<Group position={'apart'} style={{ marginBottom: "20px" }}>
							<Title
								style={{ fontSize: "30px" }}
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
												<Group position={'apart'} style={{ width: "100%", marginLeft: "20px" }}>
													<Text style={m.itemAvailable ? null : { textDecorationLine: 'line-through' }} weight={'bold'}>{m.title}</Text>
													<Text style={m.itemAvailable ? null : { textDecorationLine: 'line-through' }} weight={'bold'} color={'dimmed'} size={'md'}>
														₹{m.price}
													</Text>
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
					</Container>
				</div>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
