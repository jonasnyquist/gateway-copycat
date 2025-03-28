
import { useApi } from '../contexts/ApiContext';
import { Gateway } from './gatewayService';
import { toast } from "sonner";

export interface CloneGatewayParams {
  name: string;
  ipv4Address: string;
  comment?: string;
}

export const useGatewayClone = () => {
  const { serverUrl, sessionId } = useApi();

  const cloneGateway = async (sourceGateway: Gateway, params: CloneGatewayParams): Promise<boolean> => {
    if (!serverUrl || !sessionId) {
      toast.error("API connection not established");
      return false;
    }

    try {
      // First create the new gateway object
      const createResponse = await fetch(`${serverUrl}/web_api/add-simple-gateway`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-chkp-sid': sessionId
        },
        body: JSON.stringify({
          name: params.name,
          ip_address: params.ipv4Address,
          comment: params.comment || `Cloned from ${sourceGateway.name}`,
          // Copy relevant properties from source gateway
          version: sourceGateway.version,
          os_name: sourceGateway.os_name,
          interfaces: sourceGateway.interfaces,
          firewall: true,
          firewall_settings: sourceGateway.firewall_settings
        }),
      });

      const createData = await createResponse.json();

      if (!createResponse.ok || createData.code !== "ok") {
        throw new Error(createData.message || "Failed to create gateway clone");
      }

      // Publish changes
      await fetch(`${serverUrl}/web_api/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-chkp-sid': sessionId
        },
        body: JSON.stringify({}),
      });

      toast.success(`Gateway cloned successfully: ${params.name}`);
      return true;
    } catch (error) {
      console.error('Gateway clone error:', error);
      toast.error(`Failed to clone gateway: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  return { cloneGateway };
};
