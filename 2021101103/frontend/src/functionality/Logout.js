const Logout = () => {
    localStorage.removeItem('grediit-user-details');
    localStorage.removeItem('grediit-user-token');
    window.location.reload();
}

export default Logout;