
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserProfile } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';

const Settings: React.FC = () => {
    const { profile, setupProfile, logout } = useAppContext();
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [keywordsInput, setKeywordsInput] = useState('');

    useEffect(() => {
        if (profile) {
            setFormData(profile);
            setKeywordsInput(profile.keywords.join(', '));
        }
    }, [profile]);
    
    if (!formData) {
        return <div>Carregando...</div>
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => prev ? { ...prev, [name]: checked } : null);
        } else {
             setFormData(prev => prev ? { ...prev, [name]: type === 'number' ? Number(value) : value } : null);
        }
    };
    
    const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeywordsInput(e.target.value);
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            const keywords = keywordsInput.split(',').map(k => k.trim()).filter(Boolean);
            setupProfile({ ...formData, keywords });
            alert('Configurações salvas!');
        }
    };
    
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Configurações Avançadas</h2>
            <div className="max-w-2xl mx-auto">
                 <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-8 rounded-lg border border-slate-700">
                    <Input label="Nome do usuário ou empresa" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    <Input label="Tipo de serviço oferecido" id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} placeholder="Ex: marketing digital, conserto de ar" required />
                    <div>
                        <label htmlFor="searchRadius" className="block text-sm font-medium text-slate-300 mb-1">Raio de atuação (km): {formData.searchRadius}km</label>
                        <Input id="searchRadius" name="searchRadius" type="range" min="1" max="50" value={formData.searchRadius} onChange={handleChange} className="w-full" />
                    </div>
                    <Input label="Palavras-chave de busca (separadas por vírgula)" id="keywords" name="keywords" value={keywordsInput} onChange={handleKeywordsChange} placeholder="Ex: restaurante, pet shop, escritório" required />
                    
                    <div>
                        <label htmlFor="whatsAppMessage" className="block text-sm font-medium text-slate-300 mb-1">Mensagem automática padrão do WhatsApp</label>
                        <textarea id="whatsAppMessage" name="whatsAppMessage" value={formData.whatsAppMessage} onChange={handleChange} rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>

                    <div className="flex items-center">
                        <input id="autoSendWhatsApp" name="autoSendWhatsApp" type="checkbox" checked={formData.autoSendWhatsApp} onChange={handleChange} className="h-4 w-4 text-indigo-600 bg-slate-700 border-slate-500 rounded focus:ring-indigo-500" />
                        <label htmlFor="autoSendWhatsApp" className="ml-2 block text-sm text-slate-300">Ativar envio automático via WhatsApp (Simulado)</label>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                      <Button type="button" variant="danger" onClick={logout}>Sair da conta</Button>
                      <Button type="submit">Salvar Alterações</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
