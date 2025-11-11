
import React from 'react';
import { useAppContext } from '../context/AppContext';
import Input from '../components/Input';
import Button from '../components/Button';
import MapPinIcon from '../components/icons/MapPinIcon';

const Login: React.FC = () => {
  const { login } = useAppContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here.
    login();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-indigo-600 rounded-full p-3 mb-4">
            <MapPinIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">GeoLead AI</h1>
          <p className="mt-2 text-slate-400">Encontre novos clientes próximos a você com ajuda da IA.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <Input id="email" type="email" placeholder="Email (use any)" required />
          <Input id="password" type="password" placeholder="Senha (use any)" required />
          <div>
            <Button type="submit" className="w-full">
              Entrar / Criar Conta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
