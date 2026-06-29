import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
const initAdminAccount = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const adminEmail = 'admin@vam.vn';
  
  if (!users.find(u => u.email === adminEmail)) {
    const adminAccount = {
      name: 'Quản trị viên',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    users.push(adminAccount);
    localStorage.setItem('users', JSON.stringify(users));
    console.log("Đã tạo tài khoản Admin cứng: admin@vam.vn / admin123");
  }
};

initAdminAccount();