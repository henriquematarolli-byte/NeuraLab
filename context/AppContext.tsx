
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { UserProfile, Lead, View, ChatMessage } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";

interface AppContextType {
  isAuthenticated: boolean;
  isProfileSetup: boolean;
  profile: UserProfile | null;
  leads: Lead[];
  activeView: View;
  chatHistory: ChatMessage[];
  chat: Chat | null;
  login: () => void;
  logout: () => void;
  setupProfile: (profile: UserProfile) => void;
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  setActiveView: (view: View) => void;
  addChatMessage: (message: ChatMessage) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isProfileSetup, setIsProfileSetup] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    setIsProfileSetup(false);
    setProfile(null);
    setLeads([]);
    setActiveView(View.Dashboard);
  };

  const setupProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsProfileSetup(true);

    const newChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are a helpful assistant for a business that provides ${newProfile.serviceType}. Your goal is to help the user manage and contact potential clients.`,
      },
    });
    setChat(newChat);
    setChatHistory([{
      id: `msg-${Date.now()}`,
      sender: 'system',
      text: `Olá, ${newProfile.name}! Estou pronto para te ajudar a encontrar e contatar novos clientes.`
    }])
  };

  const addLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
  };

  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status } : lead));
  };
  
  const addChatMessage = useCallback((message: ChatMessage) => {
     setChatHistory(prev => [...prev, message]);
  }, []);

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      isProfileSetup,
      profile,
      leads,
      activeView,
      chatHistory,
      chat,
      login,
      logout,
      setupProfile,
      setLeads,
      addLead,
      updateLeadStatus,
      setActiveView,
      addChatMessage,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
