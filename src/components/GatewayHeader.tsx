
import { Gateway } from '../services/gatewayService';
import { ArrowLeft } from 'lucide-react';
import GatewayCloneForm from './GatewayCloneForm';
import ActionButton from './ActionButton';

interface GatewayHeaderProps {
  gateway: Gateway;
  onBack: () => void;
  onRefresh: () => void;
}

const GatewayHeader = ({ gateway, onBack, onRefresh }: GatewayHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2">
          <ActionButton 
            onClick={onBack} 
            icon={<ArrowLeft className="h-4 w-4" />} 
            variant="outline"
          >
            Back
          </ActionButton>
          <h1 className="text-xl md:text-2xl font-bold">{gateway.name}</h1>
        </div>
        {gateway.ipv4_address && (
          <p className="text-gray-500 mt-1">{gateway.ipv4_address}</p>
        )}
      </div>
      <div className="flex gap-2">
        <GatewayCloneForm gateway={gateway} onCloneSuccess={onRefresh} />
      </div>
    </div>
  );
};

export default GatewayHeader;
