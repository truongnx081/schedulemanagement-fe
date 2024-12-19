import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.scope;
  }
  return null;
};