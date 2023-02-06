import { Button } from 'antd';
import { executeTransform } from 'class-formatter';
import { useEffect } from 'react';
import Test from 'src/models/test';
import { useWasm } from '../../hooks';
import logo from './images/logo.svg';
import './style/index.less';

function Home() {

	const { welcome } = useWasm();

	useEffect(() => {
		console.log(executeTransform(Test, {}));
	}, []);
	
	const hello = async () => {
		welcome?.('你好');
	};

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<Button onClick={hello}>
					你好
				</Button>
			</header>
		</div>
	);
}

export default Home;
