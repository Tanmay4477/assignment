"use client";

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50 items-center justify-center">
      <div className="text-center p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Select a chat to start messaging
        </h3>
        <p className="text-sm text-gray-500">
          Choose a conversation from the list
        </p>
      </div>
    </div>
  );
};

export default EmptyState;