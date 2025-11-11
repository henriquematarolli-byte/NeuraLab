
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserProfile } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';

const ProfileSetup: React.FC = () => {
  const { setupProfile } = useAppContext();
  const [profileData, setProfileData] = useState<Omit<UserProfile, 'whatsAppMessage'>>({
    name: '',
    serviceType: '',
    searchRadius: 10,
    keywords: [],
    autoSendWhatsApp: false,
  });
  const [keywordsInput, setKeywordsInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setProfileData(prev => ({ ...prev, [name]: checked }));
    } else {
        setProfileData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    }
  };
  
  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordsInput(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keywords = keywordsInput.split(',').map(k => k.trim()).filter(Boolean);
    const fullProfile: UserProfile = {
      ...profileData,
      keywords,
      whatsAppMessage: `Olá, [Nome do Cliente]! Somos a ${profileData.name} e oferecemos serviços de ${profileData.serviceType}. Vimos que seu estabelecimento está próximo e gostaríamos de saber se podemos ajudar.`,
    };
    setupProfile(fullProfile);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-lg p-8 space-y-6 bg-slate-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-white">Configuração do Perfil</h2>
        <p className="text-center text-slate-400">Nos diga um pouco sobre seu negócio para começar a encontrar clientes.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome do usuário ou empresa" id="name" name="name" value={profileData.name} onChange={handleChange} required />
          <Input label="Tipo de serviço oferecido" id="serviceType" name="serviceType" value={profileData.serviceType} onChange={handleChange} placeholder="Ex: marketing digital, conserto de ar" required />
          <div>
            <label htmlFor="searchRadius" className="block text-sm font-medium text-slate-300 mb-1">Raio de atuação (km)</label>
            <Input id="searchRadius" name="searchRadius" type="range" min="1" max="50" value={profileData.searchRadius} onChange={handleChange} className="w-full" />
            <div className="text-center text-slate-400">{profileData.searchRadius} km</div>
          </div>
          <Input label="Palavras-chave de busca (separadas por vírgula)" id="keywords" name="keywords" value={keywordsInput} onChange={handleKeywordsChange} placeholder="Ex: restaurante, pet shop, escritório" required />
          <div className="flex items-center">
            <input id="autoSendWhatsApp" name="autoSendWhatsApp" type="checkbox" checked={profileData.autoSendWhatsApp} onChange={handleChange} className="h-4 w-4 text-indigo-600 bg-slate-700 border-slate-500 rounded focus:ring-indigo-500" />
            <label htmlFor="autoSendWhatsApp" className="ml-2 block text-sm text-slate-300">Ativar envio automático via WhatsApp (Simulado)</label>
          </div>
          <Button type="submit" className="w-full">Salvar e Iniciar Rastreamento</Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
