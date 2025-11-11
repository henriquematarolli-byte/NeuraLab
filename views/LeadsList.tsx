
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Lead } from '../types';
import Card from '../components/Card';

const statusStyles: { [key in Lead['status']]: string } = {
  new: 'bg-blue-500/20 text-blue-300 border-blue-500',
  contacted: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
  waiting: 'bg-orange-500/20 text-orange-300 border-orange-500',
  converted: 'bg-green-500/20 text-green-300 border-green-500',
  lost: 'bg-red-500/20 text-red-300 border-red-500',
};

const LeadCard: React.FC<{ lead: Lead }> = ({ lead }) => {
    const { updateLeadStatus } = useAppContext();

    return (
        <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-indigo-400">{lead.name}</h3>
                <p className="text-sm text-slate-400">{lead.address}</p>
                <p className="text-xs text-slate-500 mt-1">{lead.type} | {lead.contact}</p>
            </div>
            <div className="flex items-center gap-4">
                <select 
                    value={lead.status} 
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                    className={`text-sm rounded-md px-2 py-1 border bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${statusStyles[lead.status]}`}
                >
                    <option value="new">Novo</option>
                    <option value="contacted">Contatado</option>
                    <option value="waiting">Aguardando</option>
                    <option value="converted">Convertido</option>
                    <option value="lost">Perdido</option>
                </select>
            </div>
        </Card>
    );
}

const LeadsList: React.FC = () => {
  const { leads } = useAppContext();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-1 text-white">Lista de Clientes Potenciais</h2>
      <p className="text-slate-400 mb-6">Gerencie os clientes encontrados pela IA.</p>
      
      {leads.length === 0 ? (
          <div className="text-center py-16">
              <p className="text-slate-400">Nenhum cliente potencial encontrado ainda.</p>
              <p className="text-sm text-slate-500">Vá para o Dashboard para iniciar uma busca.</p>
          </div>
      ) : (
          <div className="space-y-4">
              {leads.map(lead => (
                  <LeadCard key={lead.id} lead={lead} />
              ))}
          </div>
      )}
    </div>
  );
};

export default LeadsList;
