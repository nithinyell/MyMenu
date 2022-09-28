import React from "react";

import Route from "./components/Route"
import './App.css';
import Home from './components/Home';
import Menu from './components/Menu';

const App = () => {
	return (
		<div className="My Menu">
			<Route path="/">
				<Menu />
			</Route>
			<Route path="/menu">
				<Home />
			</Route>
		</div>
	)
};

export default App;
