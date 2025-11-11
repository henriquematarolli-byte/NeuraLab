
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Lead } from '../types';
import Card from '../components/Card';

const StatsView: React.FC = () => {
    const { leads } = useAppContext();

    const totalLeads = leads.length;
    const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
    }, {} as { [key in Lead['status']]: number });
    
    const conversionRate = totalLeads > 0 ? ((leadsByStatus.converted || 0) / totalLeads) * 100 : 0;
    
    const statusData = [
        { name: 'Novos', value: leadsByStatus.new || 0 },
        { name: 'Contatados', value: leadsByStatus.contacted || 0 },
        { name: 'Aguardando', value: leadsByStatus.waiting || 0 },
        { name: 'Convertidos', value: leadsByStatus.converted || 0 },
        { name: 'Perdidos', value: leadsByStatus.lost || 0 },
    ];

    const leadsByType = leads.reduce((acc, lead) => {
        const type = lead.type || 'Desconhecido';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });
    
    const typeData = Object.entries(leadsByType).map(([name, value]) => ({ name, value }));

    const COLORS = ['#818cf8', '#f59e0b', '#fb923c', '#4ade80', '#f87171'];

    return (
        <div>
            <h2 className="text-3xl font-bold mb-1 text-white">Painel de Estatísticas</h2>
            <p className="text-slate-400 mb-6">Visualize o desempenho da sua prospecção.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <h3 className="text-slate-400 text-sm">Total de Clientes Encontrados</h3>
                    <p className="text-4xl font-bold text-white">{totalLeads}</p>
                </Card>
                <Card>
                    <h3 className="text-slate-400 text-sm">Clientes Convertidos</h3>
                    <p className="text-4xl font-bold text-green-400">{leadsByStatus.converted || 0}</p>
                </Card>
                <Card>
                    <h3 className="text-slate-400 text-sm">Taxa de Conversão</h3>
                    <p className="text-4xl font-bold text-indigo-400">{conversionRate.toFixed(1)}%</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-bold mb-4 text-white">Leads por Status</h3>
                    {leads.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} outerRadius={110} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-slate-500 text-center py-24">Sem dados para exibir</p>}
                </Card>
                 <Card>
                    <h3 className="font-bold mb-4 text-white">Oportunidades por Tipo de Cliente</h3>
                     {leads.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                                <XAxis type="number" stroke="#64748b" />
                                <YAxis type="category" dataKey="name" stroke="#64748b" width={100} tick={{ fill: '#94a3b8' }} />
                                <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}/>
                                <Bar dataKey="value" fill="#818cf8" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-slate-500 text-center py-24">Sem dados para exibir</p>}
                </Card>
            </div>
        </div>
    );
};

export default StatsView;
