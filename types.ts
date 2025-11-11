
export interface UserProfile {
  name: string;
  serviceType: string;
  searchRadius: number;
  keywords: string[];
  autoSendWhatsApp: boolean;
  whatsAppMessage: string;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
  web?: {
    uri: string;
    title: string;
  };
}

export interface Lead {
  id: string;
  name: string;
  address: string;
  type: string;
  contact: string;
  relevance: 'hot' | 'medium' | 'cold';
  status: 'new' | 'contacted' | 'waiting' | 'converted' | 'lost';
  distance?: number;
  sources: GroundingChunk[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  leadContext?: Lead;
}

export enum View {
  Dashboard = 'Dashboard',
  Leads = 'Leads',
  Chatbot = 'Chatbot',
  Stats = 'Stats',
  Settings = 'Settings',
}
