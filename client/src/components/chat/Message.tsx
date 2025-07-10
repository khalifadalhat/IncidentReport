import { IMessage } from '@/Types/Icase';
import { format } from 'date-fns';

interface MessageProps {
  message: IMessage;
  isCurrentUser: boolean;
}

export const Message = ({ message, isCurrentUser }: MessageProps) => (
  <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-xs md:max-w-md rounded-lg p-3 ${
        isCurrentUser
          ? 'bg-blue-600 text-white rounded-br-none'
          : 'bg-white text-gray-800 shadow rounded-bl-none'
      }`}>
      <div className="text-sm">{message.text}</div>
      <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
        {format(new Date(message.timestamp), 'h:mm a')}
      </div>
    </div>
  </div>
);
