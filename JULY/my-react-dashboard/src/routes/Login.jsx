import { Link } from 'react-router-dom';

function Login() {
    return(
        <>
            <div className="text-center mt-20 text-2xl">Login Page</div>
            <Link to="/signup" className="text-blue-500 underline">Don't have an account? Sign Up</Link>
        </>
  ) }
  export default Login
  