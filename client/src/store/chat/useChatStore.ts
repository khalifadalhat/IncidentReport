import { ICase, IMessage } from '@/Types/Icase';
import { create } from 'zustand';

interface ChatState {
  messages: IMessage[];
  activeCase: ICase | null;
  loading: boolean;
  error: string | null;
  setMessages: (messages: IMessage[]) => void;
  addMessage: (message: IMessage) => void;
  setActiveCase: (caseItem: ICase | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>(set => ({
  messages: [],
  activeCase: null,
  loading: false,
  error: null,
  setMessages: messages => set({ messages }),
  addMessage: message => set(state => ({ messages: [...state.messages, message] })),
  setActiveCase: activeCase => set({ activeCase }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));
