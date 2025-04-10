import Login from '../components/Login.tsx';
import videoBack from '../assets/clouds.mp4';
import logoImage from '../assets/logoFull.png';
import '../css/HomePage.css';

const LoginPage = () =>
{
	return (
		<div className='page-content'>
			<video src={videoBack} autoPlay loop muted />
			<Login />
		</div>
	);
};

export default LoginPage;
