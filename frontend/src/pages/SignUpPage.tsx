// SignUpPage.tsx
import SignUp from '../components/SignUp.tsx';
import videoBack from '../assets/clouds.mp4';
import '../css/HomePage.css';

const SignUpPage = () =>
{
	return (
		<div className='page-content'>
			<video src={videoBack} autoPlay loop muted preload="auto" />
			<SignUp />
		</div>
	);
};

export default SignUpPage;
