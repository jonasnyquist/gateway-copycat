
import { toast } from "sonner";

export interface Gateway {
  uid: string;
  name: string;
  type: string;
  ipv4_address: string;
  sic_state?: string;
  version?: string;
  os_name?: string;
  hardware?: string;
  interfaces?: any[];
  domain?: {
    name: string;
    domain_type: string;
  };
  [key: string]: any;
}

export const fetchGateways = async (serverUrl: string, sessionId: string): Promise<Gateway[]> => {
  try {
    const response = await fetch(`${serverUrl}/web_api/show-gateways-and-servers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-chkp-sid': sessionId
      },
      body: JSON.stringify({
        "details-level": "full"
      }),
    });

    const data = await response.json();

    if (data.objects) {
      return data.objects;
    } else {
      throw new Error(data.message || "Failed to fetch gateways");
    }
  } catch (error) {
    console.error('Error fetching gateways:', error);
    throw error;
  }
};

export const fetchGatewayDetails = async (
  serverUrl: string, 
  sessionId: string, 
  uid: string
): Promise<Gateway> => {
  try {
    const response = await fetch(`${serverUrl}/web_api/show-gateway`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-chkp-sid': sessionId
      },
      body: JSON.stringify({
        uid,
        "details-level": "full"
      }),
    });

    const data = await response.json();

    if (data.object) {
      return data.object;
    } else {
      throw new Error(data.message || "Failed to fetch gateway details");
    }
  } catch (error) {
    console.error('Error fetching gateway details:', error);
    throw error;
  }
};

export const cloneGateway = async (
  serverUrl: string, 
  sessionId: string, 
  originalGateway: Gateway, 
  newName: string,
  newIpv4Address: string
): Promise<Gateway> => {
  // Create clone object, removing read-only fields
  const { uid, ...gatewayWithoutUid } = originalGateway;
  
  // Prepare the clone data
  const cloneData = {
    ...gatewayWithoutUid,
    name: newName,
    ipv4_address: newIpv4Address,
  };
  
  try {
    // Create the cloned gateway
    const response = await fetch(`${serverUrl}/web_api/add-simple-gateway`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-chkp-sid': sessionId
      },
      body: JSON.stringify(cloneData),
    });

    const data = await response.json();

    if (data.uid) {
      toast.success(`Gateway '${newName}' created successfully`);
      return data;
    } else {
      throw new Error(data.message || "Failed to clone gateway");
    }
  } catch (error) {
    console.error('Error cloning gateway:', error);
    throw error;
  }
};

export const publishChanges = async (serverUrl: string, sessionId: string): Promise<boolean> => {
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

    if (data.task_id) {
      toast.success("Changes published successfully");
      return true;
    } else {
      throw new Error(data.message || "Failed to publish changes");
    }
  } catch (error) {
    console.error('Error publishing changes:', error);
    toast.error("Failed to publish changes");
    return false;
  }
};
