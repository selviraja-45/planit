export const logoutUser = () => {
    localStorage.removeItem('plantit-token');
    window.location.href = '/login';
};
  