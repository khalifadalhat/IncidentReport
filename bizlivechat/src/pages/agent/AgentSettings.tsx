import React from 'react';

const AgentSettings: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl mb-4">Settings</h2>
      <div className="space-y-4">
        <button className="bg-blue-500 text-white p-2 rounded">Update Profile</button>
        <button className="bg-red-500 text-white p-2 rounded">Change Password</button>
        <button className="bg-gray-500 text-white p-2 rounded">Logout</button>
      </div>
    </div>
  );
};

export default AgentSettings;
