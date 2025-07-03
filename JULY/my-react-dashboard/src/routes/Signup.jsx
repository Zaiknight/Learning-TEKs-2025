import officeImg from 'E:/Learning/WebDevelopment/2025/JULY/my-react-dashboard/src/assets/create-account-office.jpeg';
import officeImgDark from 'E:/Learning/WebDevelopment/2025/JULY/my-react-dashboard/src/assets/create-account-office-dark.jpeg';


function Signup() {
  return (
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
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
                    className="block w-full mt-2 mb-2 py-3 p-3 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus: dark:text-gray-300"
                    id="email"
                    placeholder="JaneDoe@gmail.com"
                    type="email"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">First Name</span>
                  <input
                    className="block w-full mt-2 mb-2 py-3 p-3 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus: dark:text-gray-300"
                    id="fname"
                    placeholder="Jane"
                    type="text"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Last Name</span>
                  <input
                    className="block w-full mt-2 mb-2 py-3 p-3 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus: dark:text-gray-300"
                    id="lname"
                    placeholder="Doe"
                    type="text"
                  />
                </label>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Password</span>
                  <input
                    className="block w-full mt-2 mb-2 py-3 p-3 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus: dark:text-gray-300"
                    id="pw"
                    placeholder="***************"
                    type="password"
                  />
                </label>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Confirm password</span>
                  <input
                    className="block w-full mt-2 mb-2 py-3 p-3 rounded-lg text-sm dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus: dark:text-gray-300"
                    id="pwC"
                    placeholder="***************"
                    type="password"
                  />
                </label>
                <div className="flex mt-6 text-sm">
                  <label className="flex items-center dark:text-gray-400">
                    <input
                      type="checkbox"
                      className="text-purple-600 rounded focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                    <span className="ml-2">
                      I agree to the
                      <span className="underline"> privacy policy</span>
                    </span>
                  </label>
                </div>


                <button
                    className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    //onClick={store}
                    id="registerButton">Create account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
  export default Signup;