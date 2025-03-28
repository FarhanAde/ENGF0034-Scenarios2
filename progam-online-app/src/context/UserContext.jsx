import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

// Create context with default value
const UserContext = createContext(null);

// Create provider component
export function UserProvider({ children }) {
  // Hardcoded user with ID 0
  const activeUser = { id: 2, name: "Farhan" };
  
  return (
    <UserContext.Provider value={{ activeUser }}>
      {children}
    </UserContext.Provider>
  );
}
// Custom hook for easier consumption
export function useUser() {
  return useContext(UserContext);
}

// Add prop type validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};