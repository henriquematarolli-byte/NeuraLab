
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChatMessage, Lead } from '../types';
import Button from '../components/Button';
import BotIcon from '../components/icons/BotIcon';

const ChatbotView: React.FC = () => {
  const { chatHistory, addChatMessage, chat, profile } = useAppContext();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatHistory]);
  
  const handleSendWhatsApp = (lead: Lead) => {
    addChatMessage({
      id: `msg-system-${Date.now()}`,
      sender: 'system',
      text: `(Simulação) Enviando mensagem via WhatsApp para ${lead.name}: "${profile?.whatsAppMessage.replace('[Nome do Cliente]', lead.name)}"`
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: input,
    };
    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chat.sendMessageStream({ message: input });
      let botResponseText = '';
      for await (const chunk of response) {
        botResponseText += chunk.text;
      }

      const botMessage: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: botResponseText,
      };
      addChatMessage(botMessage);
    } catch (error) {
      console.error('Gemini chat error:', error);
      const errorMessage: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: 'Desculpe, ocorreu um erro ao me comunicar. Por favor, tente novamente.',
      };
      addChatMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-1 text-white">Chatbot Assistente</h2>
      <p className="text-slate-400 mb-6">Converse com a IA para obter insights ou preparar mensagens para clientes.</p>

      <div className="flex-1 bg-slate-800 rounded-lg p-4 flex flex-col border border-slate-700 overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {chatHistory.map(msg => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender !== 'user' && <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1"><BotIcon className="w-5 h-5 text-white" /></div>}
              <div className={`max-w-lg p-3 rounded-lg ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' 
                : msg.sender === 'bot' ? 'bg-slate-700 text-slate-200 rounded-bl-none'
                : 'w-full bg-slate-700/50 border border-slate-600 text-slate-400 text-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.leadContext && profile?.autoSendWhatsApp && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <p className="text-xs text-slate-400 mb-2">Deseja enviar a mensagem automática padrão para este cliente?</p>
                    <Button size="sm" onClick={() => handleSendWhatsApp(msg.leadContext as Lead)}>Sim, enviar via WhatsApp</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1"><BotIcon className="w-5 h-5 text-white" /></div>
               <div className="max-w-lg p-3 rounded-lg bg-slate-700 text-slate-200 rounded-bl-none">
                 <div className="flex items-center gap-1">
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isTyping}
          />
          <Button type="submit" isLoading={isTyping}>Enviar</Button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotView;
