import { useEffect, useState } from 'react';

const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem('planit-token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('planit-token'));
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { token, isAuthenticated: !!token };
};

export default useAuth;
