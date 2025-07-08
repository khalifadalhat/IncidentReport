import React from 'react';
import Picker from 'emoji-picker-react';
import { EmojiClickData } from 'emoji-picker-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelect(emojiData.emoji);
  };

  return (
    <div className="shadow-lg rounded-lg overflow-hidden">
      <Picker
        onEmojiClick={handleEmojiClick}
        width={300}
        height={350}
        previewConfig={{ showPreview: false }}
      />
    </div>
  );
};

export default EmojiPicker;
