
import { useState } from 'react';
import { ApiProvider } from '../contexts/ApiContext';
import { useApi } from '../contexts/ApiContext';
import { Gateway } from '../services/gatewayService';
import LoginForm from '../components/LoginForm';
import GatewayList from '../components/GatewayList';
import GatewayDetail from '../components/GatewayDetail';

const GatewayManager = () => {
  const { isAuthenticated } = useApi();
  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);

  const handleSelectGateway = (gateway: Gateway) => {
    setSelectedGateway(gateway);
  };

  const handleBackToList = () => {
    setSelectedGateway(null);
  };

  const handleRefreshList = () => {
    setSelectedGateway(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {selectedGateway ? (
        <GatewayDetail 
          gateway={selectedGateway} 
          onBack={handleBackToList}
          onRefresh={handleRefreshList}
        />
      ) : (
        <GatewayList onSelectGateway={handleSelectGateway} />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <ApiProvider>
      <GatewayManager />
    </ApiProvider>
  );
};

export default Index;
