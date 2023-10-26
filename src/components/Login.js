import React from 'react';
import './Login.css';
import Api from '../Api';

const Login = ({ onReceive }) => {
  const handleFacebookLogin = async () => {
    try {
      const result = await Api.fbPopup();
      onReceive(result.user);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao fazer login com o Facebook');
    }
  };

  return (
    <div className="login">
      <button onClick={handleFacebookLogin}>Login com Facebook</button>
    </div>
  );
};

export default Login;