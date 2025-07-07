import React, { useState, useEffect } from "react";
import SidebarLayout from '../components/MainComponent.jsx';

// Helper to get users from localStorage
function getStoredUsers() {
  return JSON.parse(localStorage.getItem("all_users")) || [];
}

// Helper to determine if user is admin
function isUserAdmin(user) {
  return user && (user.isAdmin === true || user.isAdmin === "true");
}

// Helper to get current logged-in user (assume stored in localStorage as "current_user")
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("current_user")) || {};
}

// Helper to format the date (CreatedAt)
function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // fallback to raw if parse fails
    // Format: YYYY-MM-DD or DD/MM/YYYY or as needed
    // Here: DD/MM/YYYY
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth()+1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  } catch {
    return dateString;
  }
}

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    setUsers(getStoredUsers());
    setCurrentUser(getCurrentUser());
  }, []);

  // Delete user by index
  function deleteUser(index) {
    const userList = getStoredUsers();
    userList.splice(Number(index), 1);
    localStorage.setItem("all_users", JSON.stringify(userList));
    setUsers(userList); // Update state to re-render
  }

  // Only admins can delete, and they cannot delete admins (including themselves)
  function canDelete(targetUser) {
    const currentIsAdmin = isUserAdmin(currentUser);
    const targetIsAdmin = isUserAdmin(targetUser);
    if (!currentIsAdmin) return false;
    if (targetIsAdmin) return false;
    return true;
  }

  // Only admins can edit
  function canEdit(targetUser) {
    return isUserAdmin(currentUser);
  }

  return (
    <SidebarLayout>
      <main className="h-full pb-16 overflow-y-auto">
        <div className="container grid px-6 mx-auto">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Users List
          </h2>
          <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
            {/* Optional subtitle or description */}
          </h4>
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap" id="userTable">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th className="px-4 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800" id="userElement">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user, i) => {
                      const admin = isUserAdmin(user);
                      const canEditUser = canEdit(user);
                      const canDeleteUser = canDelete(user);

                      return (
                        <tr key={i} className="text-gray-700 dark:text-gray-400 align-left">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-semibold dark:text-white">{user.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {user.description || (admin ? "SuperUser" : "User")}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-xs">
                            <span className="px-2 py-1 font-semibold leading-tight text-green-700 dark:text-white">
                              {user.role || (admin ? "Admin" : "Standard")}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {formatDate(user.CreatedAt)}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center space-x-4 text-sm">
                              {/* Edit Button */}
                              <button
                                className={`flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 rounded-lg focus:outline-none focus:shadow-outline-gray
                                  ${canEditUser
                                    ? "text-purple-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-gray-700"
                                    : "text-gray-400 bg-gray-200 dark:text-gray-700 dark:bg-gray-700 cursor-not-allowed"
                                  }`}
                                aria-label="Edit"
                                disabled={!canEditUser}
                                tabIndex={canEditUser ? 0 : -1}
                              >
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                </svg>
                              </button>
                              {/* Delete Button */}
                              <button
                                className={`flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 rounded-lg focus:outline-none focus:shadow-outline-gray
                                  ${canDeleteUser
                                    ? "text-purple-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-gray-700"
                                    : "text-gray-400 bg-gray-200 dark:text-gray-700 dark:bg-gray-700 cursor-not-allowed"
                                  }`}
                                aria-label="Delete"
                                onClick={canDeleteUser ? () => deleteUser(i) : undefined}
                                disabled={!canDeleteUser}
                                tabIndex={canDeleteUser ? 0 : -1}
                              >
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
              <span className="flex items-center col-span-3">
                Showing {users.length > 0 ? `1-${users.length}` : "0-0"} of {users.length}
              </span>
              <span className="col-span-2"></span>
            </div>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}