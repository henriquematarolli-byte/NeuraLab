
import { GoogleGenAI } from "@google/genai";
import { UserProfile, Lead, GroundingChunk } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const parseLeadsFromMarkdown = (markdown: string, sources: GroundingChunk[]): Lead[] => {
  const leads: Lead[] = [];
  const leadSections = markdown.split('---').filter(section => section.trim() !== '');

  leadSections.forEach((section, index) => {
    const nameMatch = section.match(/\*\*Nome:\*\*\s*(.*)/);
    const addressMatch = section.match(/\*\*Endereço:\*\*\s*(.*)/);
    const typeMatch = section.match(/\*\*Tipo:\*\*\s*(.*)/);
    const contactMatch = section.match(/\*\*Contato:\*\*\s*(.*)/);

    if (nameMatch && addressMatch && typeMatch) {
      const relevanceLevels: Array<'hot' | 'medium' | 'cold'> = ['hot', 'medium', 'cold'];
      leads.push({
        id: `lead-${Date.now()}-${index}`,
        name: nameMatch[1].trim(),
        address: addressMatch[1].trim(),
        type: typeMatch[1].trim(),
        contact: contactMatch ? contactMatch[1].trim() : 'N/A',
        relevance: relevanceLevels[Math.floor(Math.random() * 3)],
        status: 'new',
        sources: sources
      });
    }
  });

  return leads;
};

export const findLeads = async (profile: UserProfile, location: { latitude: number; longitude: number }): Promise<Lead[]> => {
  try {
    const prompt = `
      Baseado na localização atual (latitude: ${location.latitude}, longitude: ${location.longitude}), encontre clientes em potencial para um negócio de '${profile.serviceType}'. 
      As palavras-chave para a busca são: '${profile.keywords.join(', ')}'.
      O raio de busca é de ${profile.searchRadius} km.

      Retorne uma lista de até 5 empresas. Para cada empresa, forneça as seguintes informações e separe cada empresa com '---':
      - **Nome:** [Nome da Empresa]
      - **Endereço:** [Endereço Completo]
      - **Tipo:** [Tipo de negócio, ex: Restaurante, Loja, Escritório]
      - **Contato:** [Número de telefone ou email público, se disponível]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        }
      },
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text;
    
    if (text) {
      return parseLeadsFromMarkdown(text, sources as GroundingChunk[]);
    }
    return [];
  } catch (error) {
    console.error("Error finding leads with Gemini:", error);
    throw new Error("Failed to fetch leads from AI service.");
  }
};
