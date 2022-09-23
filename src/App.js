import React from "react";

import Route from "./components/Route"
import './App.css';
import Home from './components/Home';
import Menu from './components/Menu';

export default () => {
	return (
		<div className="My Menu">
			<Route path="/">
				<Home />
			</Route>
			<Route path="/menu">
				<Menu />
			</Route>
		</div>
	)
}
