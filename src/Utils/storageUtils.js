// get
export const getAuthenticatedUser = () => localStorage.getItem(btoa("authUser")) && JSON.parse(atob(localStorage.getItem(btoa("authUser"))));
export const getLoggedUser = () => localStorage.getItem(btoa('loggedUser')) ? JSON.parse(atob(localStorage.getItem(btoa('loggedUser')))) : ""
export const getRememberCred = () => localStorage.getItem('check')
export const getPaypalAccessToken = () => localStorage.getItem("Access_token")
export const getSupportOrDispute = () => JSON.parse(localStorage.getItem("curent"))
export const getIdleTime = () => localStorage.getItem('IdleTime');

// set
export const setAuthenticatedUser = (value) => localStorage.setItem(btoa("authUser"), btoa(value));
export const setLoggedUser = (value) => localStorage.setItem(btoa("loggedUser"), btoa(JSON.stringify(value)))
export const setRememberCred = (value) => localStorage.setItem("check", true)
export const setPaypalAccessToken = (value) => localStorage.setItem("Access_token", value)
export const setSupportOrDispute = (value) => localStorage.setItem("curent", JSON.stringify(value))
export const setIdleTime = () => localStorage.setItem("IdleTime", Date.parse(new Date()))

//remove
export const removeLoggedUser = () => localStorage.removeItem(btoa('loggedUser'))
export const removeRememberCred = () => localStorage.removeItem("check")
export const removeSupportorDispute = () => localStorage.removeItem("curent")
export const removeIdleTime = () => localStorage.removeItem("IdleTime")
