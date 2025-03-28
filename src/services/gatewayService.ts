import { useEffect, useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import { toast } from "sonner";

export interface Gateway {
  uid: string;
  name: string;
  type?: string;
  domain?: {
    domain_type: string;
    name: string;
    uid: string;
  };
  policy?: {
    access: boolean;
    threat: boolean;
  };
  version?: string;
  ipv4_address?: string;
  os_name?: string;
  interfaces?: any[];
  firewall_settings?: any;
  [key: string]: any;
}

export const useGateways = (refreshTrigger = 0) => {
  const { serverUrl, sessionId } = useApi();
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGateways = async () => {
    if (!serverUrl || !sessionId) {
      setError("API connection not established");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${serverUrl}/web_api/show-simple-gateways`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-chkp-sid': sessionId
        },
        body: JSON.stringify({
          details_level: "full",
          limit: 100
        }),
      });

      const data = await response.json();

      if (data.objects) {
        setGateways(data.objects);
      } else {
        setError(data.message || "Failed to fetch gateways");
        toast.error(data.message || "Failed to fetch gateways");
      }
    } catch (error) {
      console.error('Gateway fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Failed to fetch gateways: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchGateways();
    }
  }, [sessionId, refreshTrigger]);

  return { gateways, loading, error, refetch: fetchGateways };
};

export const useGatewayDetails = (uid: string) => {
  const { serverUrl, sessionId } = useApi();
  const [gateway, setGateway] = useState<Gateway | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGatewayDetails = async () => {
    if (!serverUrl || !sessionId) {
      setError("API connection not established");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${serverUrl}/web_api/show-simple-gateway`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-chkp-sid': sessionId
        },
        body: JSON.stringify({
          uid: uid,
          details_level: "full"
        }),
      });

      const data = await response.json();

      if (data.uid) {
        setGateway(data);
      } else {
        setError(data.message || "Failed to fetch gateway details");
        toast.error(data.message || "Failed to fetch gateway details");
      }
    } catch (error) {
      console.error('Gateway details fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Failed to fetch gateway details: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId && uid) {
      fetchGatewayDetails();
    }
  }, [sessionId, uid]);

  return { gateway, loading, error, refetch: fetchGatewayDetails };
};

export const fetchGateways = async (serverUrl: string, sessionId: string): Promise<Gateway[]> => {
  try {
    const response = await fetch(`${serverUrl}/web_api/show-simple-gateways`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-chkp-sid': sessionId
      },
      body: JSON.stringify({
        details_level: "full",
        limit: 100
      }),
    });

    const data = await response.json();

    if (data.objects) {
      return data.objects;
    } else {
      toast.error(data.message || "Failed to fetch gateways");
      throw new Error(data.message || "Failed to fetch gateways");
    }
  } catch (error) {
    console.error('Gateway fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to fetch gateways: ${errorMessage}`);
    throw error;
  }
};

export const cloneGateway = async (
  serverUrl: string, 
  sessionId: string, 
  sourceGateway: Gateway, 
  newName: string,
  newIp: string
): Promise<void> => {
  try {
    const response = await fetch(`${serverUrl}/web_api/add-simple-gateway`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-chkp-sid': sessionId
      },
      body: JSON.stringify({
        name: newName,
        ip_address: newIp,
        comment: `Cloned from ${sourceGateway.name}`,
        version: sourceGateway.version,
        os_name: sourceGateway.os_name,
        interfaces: sourceGateway.interfaces,
        firewall: true,
        firewall_settings: sourceGateway.firewall_settings
      }),
    });

    const data = await response.json();

    if (!response.ok || data.code !== "ok") {
      throw new Error(data.message || "Failed to create gateway clone");
    }

    toast.success(`Gateway cloned successfully: ${newName}`);
  } catch (error) {
    console.error('Gateway clone error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to clone gateway: ${errorMessage}`);
    throw error;
  }
};

export const publishChanges = async (serverUrl: string, sessionId: string): Promise<void> => {
  try {
    const response = await fetch(`${serverUrl}/web_api/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-chkp-sid': sessionId
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    if (!response.ok || data.code !== "ok") {
      throw new Error(data.message || "Failed to publish changes");
    }

    toast.success("Changes published successfully");
  } catch (error) {
    console.error('Publish error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to publish changes: ${errorMessage}`);
    throw error;
  }
};
