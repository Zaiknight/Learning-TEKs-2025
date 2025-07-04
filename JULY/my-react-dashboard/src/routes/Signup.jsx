import officeImg from 'E:/Learning/WebDevelopment/2025/JULY/my-react-dashboard/src/assets/create-account-office.jpeg';
import officeImgDark from 'E:/Learning/WebDevelopment/2025/JULY/my-react-dashboard/src/assets/create-account-office-dark.jpeg';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  //These are the user states
  const [email,setEmail] = useState('');  
  const [firstName,setFirstName] = useState('');
  const [lastName,setLastName] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isAdmin, setIsAdmin] = useState(Boolean());
  //These are the error states
  const [emailError,setEmailError] = useState(false);
  const [passError,setPassError] = useState(false);
  const [fnameError,setFnameError] = useState(false);
  const [lnameError,setLnameError] = useState(false);
  const [exists,setExistStatement] = useState('');
  const [passErrorStatement,setPassErrorStatement] = useState('');

  const navigate = useNavigate();
  const lowerCaseLetters = /[a-z]/g;
  const upperCaseLetters = /[A-Z]/g;
  const numbers = /[0-9]/g;

  //Local Storage for user auth
  let userList = JSON.parse(localStorage.getItem("all_users")) || [];

  function store(){
    // Setting default errors to be false so they don't carry forward in next form
    setEmailError(false);
    setFnameError(false);
    setLnameError(false);
    setPassError(false);
    setPassErrorStatement('');
    setExistStatement('');

    //Creating a class would help me create User Objects to push in localstorage
    class User {
        constructor(email, name, password, isAdmin, createdAt) {
            this.email = email;
            this.name = name;
            this.password = password;
            this.isAdmin = isAdmin;
            this.createdAt = createdAt
        }
    }

    // All my IF statements for Error Validation
    if (email == '' ) {
        setEmailError(true);
        console.log("Please fill in the email")
    }
    if (firstName == ''){
      setFnameError(true);
    }
    if (lastName == '')
    {
      setLnameError(true);
    }
    if (password == '') {
        setPassError(true);
        setPassErrorStatement('Password is Required');
    } else if (password !== confirmPass) {
      setPassError(true);
      setPassErrorStatement('Passwords are not the same');
    } else if (password.length < 8) {
      setPassError(true);
      setPassErrorStatement('Minimum 8 characters required.');
    } else if (!password.match(numbers)) {
      setPassError(true);
      setPassErrorStatement('Please add 1 number');
    } else if (!password.match(upperCaseLetters)) {
      setPassError(true);
      setPassErrorStatement('Please add 1 uppercase letter');
    } else if (!password.match(lowerCaseLetters)) {
      setPassError(true);
      setPassErrorStatement('Please add 1 lowercase letter');
    } else if (userList.some(user => user.email === email)) {
      setExistStatement('This account already exists ');
    }else {
        const newUser = new User(email, `${firstName} ${lastName}`, password, isAdmin, Date.now());
        userList.push(newUser);
        localStorage.setItem('all_users', JSON.stringify(userList));
        
        navigate('/');
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
                src={officeImg}
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="object-cover w-full h-full hidden dark:inline"
                src={officeImgDark}
                alt="Office"
              />
            </div>
            <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Create account
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
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">First Name</span>
                  <input
                    className={`block w-full mt-2 mb-2 py-3 p-3 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 focus:ring-2 ${fnameError ? "border-red-500 ring-red-500 focus: dark:text-red-500 focus:outline-none": "focus:ring-purple-400 focus: dark:text-gray-300 focus:outline-none"}`}
                    id="fname"
                    placeholder="Jane"
                    type="text"
                    value = {firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setFnameError(false);
                    }}
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Last Name</span>
                  <input
                    className={`block w-full mt-2 mb-2 py-3 p-3 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 focus:ring-2 ${lnameError ? "border-red-500 ring-red-500 focus: dark:text-red-500 focus:outline-none": "focus:ring-purple-400 focus: dark:text-gray-300 focus:outline-none"}`}
                    id="lname"
                    placeholder="Doe"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setLnameError(false);
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
                    }}
                  />
                </label>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Confirm password</span>
                  <input
                    className={`block w-full mt-2 mb-2 py-3 p-3 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 focus:ring-2 ${passError ? "border-red-500 ring-red-500 focus: dark:text-red-500 focus:outline-none": "focus:ring-purple-400 focus: dark:text-gray-300 focus:outline-none"}`}
                    id="passwordC"
                    placeholder="***************"
                    type="password"
                    value = {confirmPass}
                    onChange={(e) => {
                      setConfirmPass(e.target.value);
                      setPassError(false);
                    }}
                  />
                  {passError && (<span className="text-red-500 text-sm mt-1">{passErrorStatement}</span>)}
                </label>
                <div className="flex mt-6 text-sm">
                  <label className="flex items-center dark:text-gray-400">
                    <input
                      type="checkbox"
                      className="text-purple-300 rounded-4xl focus:ring-2 focus:ring-purple-400 focus:rounded-2xl"
                      value={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    <span className="ml-2">
                      Admin
                    </span>
                  </label>
                </div>

                {exists && (<span className="text-gray-300 text-sm mt-1">{exists}<Link to="/" className="text-gray-300 text-sm mt-1 underline">Login</Link></span>)}

                <button
                    className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    onClick={store}
                    >Create account
                </button>
                
                <p
                  className="text-sm mt-4 font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Already have an account ? <Link to="/" className="text-sm mt-4 font-medium text-purple-600 dark:text-purple-400 underline">Login</Link>
                </p>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
  export default Signup;