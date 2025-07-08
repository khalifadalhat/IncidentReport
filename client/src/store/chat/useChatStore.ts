import { create } from 'zustand';
import { ICase, IMessage } from '../../Types/Icase';

interface ChatState {
  messages: IMessage[];
  activeCase: ICase | null;
  cases: ICase[];
  loading: boolean;
  error: string | null;
  setMessages: (messages: IMessage[]) => void;
  addMessage: (message: IMessage) => void;
  setActiveCase: (caseItem: ICase | null) => void;
  setCases: (cases: ICase[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>(set => ({
  messages: [],
  activeCase: null,
  cases: [],
  loading: false,
  error: null,
  setMessages: messages => set({ messages }),
  addMessage: message => set(state => ({ messages: [...state.messages, message] })),
  setActiveCase: activeCase => set({ activeCase }),
  setCases: cases => set({ cases }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));
