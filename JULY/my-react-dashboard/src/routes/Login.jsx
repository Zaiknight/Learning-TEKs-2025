import loginOfficeImg from 'E:/Learning/WebDevelopment/2025/JULY/my-react-dashboard/src/assets/login-office.jpeg';
import loginOfficeDarkImg from 'E:/Learning/WebDevelopment/2025/JULY/my-react-dashboard/src/assets/login-office-dark.jpeg';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Login() {
    const [emailError,setEmailError] = useState(false);
    const [passError,setPassError] = useState(false);
    const [errorStatement, setErrorStatement] = useState('');

    const [email,setEmail] = useState('');  
    const [password,setPassword] = useState('');
    const navigate = useNavigate();



    function setCookie(cname, cvalue,exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";"+ expires + ";path=/";
    }


    function login(){

        const userList = JSON.parse(localStorage.getItem("all_users")) || [];

        const foundUser = userList.find(user => user.email === email && user.password === password);
        if(email == ''){
            setEmailError(true);
        }
        if (password == '') {
            setPassError(true);
            setErrorStatement('Password is Required');
            return;
        }

        
        if (foundUser) {
            console.log('You are logged in.');
            setCookie("CurrentUserName",JSON.stringify(foundUser.name),1);
            setCookie("CurrentUser",JSON.stringify(foundUser),1);
            localStorage.setItem('current_user', JSON.stringify(foundUser));
            sessionStorage.setItem('login', JSON.stringify('true'));
            navigate('/dashboard');

        } else if(!foundUser){
            setErrorStatement('Account not found');
            return;
        }
    }
  return (
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-900">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full block dark:hidden"
                src={loginOfficeImg}
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="object-cover w-full h-full hidden dark:inline"
                src={loginOfficeDarkImg}
                alt="Office"
              />
            </div>
            <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Login
                </h1>
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Email</span>
                  <input
                    className={`block w-full mt-2 mb-2 py-3 p-3 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 focus:ring-2 ${emailError ? "border-red-500 ring-red-500 focus: dark:text-red-500 focus:outline-none": "focus:ring-purple-400 focus: dark:text-gray-300 focus:outline-none"}`}
                    id="email"
                    placeholder={`${emailError ? "Please Fill in your Email":"JaneDoe@gmail.com"}`}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value); 
                      setEmailError(false);
                    }}
                  />
                </label>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Password</span>
                  <input
                    className={`block w-full mt-2 mb-2 py-3 p-3 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 focus:ring-2 ${passError ? "border-red-500 ring-red-500 focus: dark:text-red-500 focus:outline-none": "focus:ring-purple-400 focus: dark:text-gray-300 focus:outline-none"}`}
                    id="password"
                    placeholder="***************"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value); 
                      setPassError(false);
                    }}/>
                </label>
                {(<span className="text-red-500 text-sm mt-1">{errorStatement}</span>)}
                <button
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  onClick={login}
                  id="loginButton"
                  type="submit"
                >
                  Login
                </button>
                {<p
                  className="text-sm mt-4 font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Don't have an account ? <Link to="/signup" className="text-sm mt-4 font-medium text-purple-600 dark:text-purple-400 underline">Create Account</Link>
                </p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

  export default Login
  