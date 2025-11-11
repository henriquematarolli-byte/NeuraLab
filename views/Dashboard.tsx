
import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { findLeads } from '../services/geminiService';
import { Lead, View } from '../types';
import Spinner from '../components/Spinner';
import Card from '../components/Card';
import Button from '../components/Button';
import MapPinIcon from '../components/icons/MapPinIcon';

const LeadPin: React.FC<{ lead: Lead, onSelect: (lead: Lead) => void }> = ({ lead, onSelect }) => {
    const relevanceColor = {
        hot: 'bg-red-500',
        medium: 'bg-yellow-500',
        cold: 'bg-blue-500'
    };
    return (
        <div 
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
            style={{ 
                left: `${Math.random() * 80 + 10}%`, 
                top: `${Math.random() * 80 + 10}%` 
            }}
            onClick={() => onSelect(lead)}
        >
            <MapPinIcon className={`w-10 h-10 text-slate-300 drop-shadow-lg group-hover:scale-125 transition-transform`} />
            <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-slate-800 ${relevanceColor[lead.relevance]}`}></div>
             <div className="absolute bottom-full mb-2 w-48 bg-slate-800 text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -translate-x-1/2 left-1/2">
                {lead.name}
            </div>
        </div>
    );
}

const LeadDetailModal: React.FC<{ lead: Lead | null, onClose: () => void, onGoToChat: (lead: Lead) => void }> = ({ lead, onClose, onGoToChat }) => {
    if (!lead) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <h3 className="text-xl font-bold text-indigo-400 mb-2">{lead.name}</h3>
                <p className="text-slate-400">{lead.address}</p>
                <p className="text-sm text-slate-500 capitalize mt-1">Tipo: {lead.type}</p>
                <p className="text-sm text-slate-500 mt-1">Contato: {lead.contact}</p>
                 <div className="mt-4">
                    <h4 className="font-semibold text-slate-300 mb-2">Fontes:</h4>
                    <ul className="space-y-1 text-sm max-h-24 overflow-y-auto">
                        {lead.sources.map((source, idx) => (
                           (source.maps || source.web) && <li key={idx}>
                                <a href={(source.maps?.uri || source.web?.uri)} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                                    {(source.maps?.title || source.web?.title)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={onClose}>Fechar</Button>
                    <Button onClick={() => onGoToChat(lead)}>Ver Detalhes e Contatar</Button>
                </div>
            </Card>
        </div>
    );
}


const Dashboard: React.FC = () => {
  const { profile, leads, setLeads, addChatMessage, setActiveView } = useAppContext();
  const { data: location, error: geoError, loading: geoLoading } = useGeolocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchInitialLeads = useCallback(async () => {
    if (profile && location && leads.length === 0) {
      setIsLoading(true);
      setError(null);
      try {
        const newLeads = await findLeads(profile, location);
        setLeads(newLeads);
        if (newLeads.length > 0) {
           addChatMessage({
               id: `msg-system-${Date.now()}`,
               sender: 'system',
               text: `Encontrei ${newLeads.length} novas oportunidades perto de você.`,
           });
        }
      } catch (e) {
        setError("Falha ao buscar clientes. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, location]);

  useEffect(() => {
    fetchInitialLeads();
  }, [fetchInitialLeads]);

  const handleGoToChat = (lead: Lead) => {
    addChatMessage({
        id: `msg-system-${Date.now()}`,
        sender: 'system',
        text: `Preparando para contatar ${lead.name}. O que você gostaria de dizer?`,
        leadContext: lead,
    });
    setSelectedLead(null);
    setActiveView(View.Chatbot);
  }

  const renderContent = () => {
    if (geoLoading || (isLoading && leads.length === 0)) {
      return <div className="flex items-center justify-center h-full"><Spinner text={geoLoading ? "Obtendo sua localização..." : "Buscando clientes com IA..."} /></div>;
    }
    if (geoError) {
      return <div className="text-center text-red-400">Erro de localização: {geoError.message}. Por favor, habilite a permissão de localização.</div>;
    }
     if (error) {
      return <div className="text-center text-red-400">{error}</div>;
    }
    if (leads.length === 0) {
        return <div className="text-center text-slate-400">Nenhuma oportunidade encontrada ainda. Tente ajustar suas palavras-chave nas configurações.</div>;
    }

    return (
       <div className="relative w-full h-[calc(100vh-10rem)] bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-700" style={{backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-transparent"></div>
          {leads.map(lead => <LeadPin key={lead.id} lead={lead} onSelect={setSelectedLead} />)}
       </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-1 text-white">Dashboard de Ocorrências</h2>
      <p className="text-slate-400 mb-6">Pinos de oportunidades próximas encontradas pela IA.</p>
      {renderContent()}
      <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} onGoToChat={handleGoToChat}/>
    </div>
  );
};

export default Dashboard;
