
import { useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import { Gateway, cloneGateway, publishChanges } from '../services/gatewayService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface GatewayDetailProps {
  gateway: Gateway;
  onBack: () => void;
  onRefresh: () => void;
}

const GatewayDetail = ({ gateway, onBack, onRefresh }: GatewayDetailProps) => {
  const { serverUrl, sessionId } = useApi();
  const [newName, setNewName] = useState('');
  const [newIp, setNewIp] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClone = async () => {
    if (!sessionId || !serverUrl) {
      toast.error("Not authenticated");
      return;
    }

    if (!newName || !newIp) {
      toast.error("Name and IP address are required");
      return;
    }

    setIsCloning(true);
    try {
      await cloneGateway(serverUrl, sessionId, gateway, newName, newIp);
      await publishChanges(serverUrl, sessionId);
      setIsDialogOpen(false);
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to clone gateway");
    } finally {
      setIsCloning(false);
    }
  };

  // Initialize clone form with suggested values
  const initializeCloneForm = () => {
    setNewName(`Copy_of_${gateway.name}`);
    setNewIp('');
    setIsDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>{gateway.name}</CardTitle>
        </div>
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={initializeCloneForm}
                className="bg-checkpoint-600 hover:bg-checkpoint-700"
              >
                <Copy className="mr-2 h-4 w-4" />
                Clone Gateway
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clone Gateway</DialogTitle>
                <DialogDescription>
                  Create a copy of this gateway with a new name and IP address.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="clone-name">New Gateway Name</Label>
                  <Input
                    id="clone-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter new gateway name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clone-ip">New IP Address</Label>
                  <Input
                    id="clone-ip"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    placeholder="Enter new IP address"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleClone} 
                  disabled={isCloning}
                  className="bg-checkpoint-600 hover:bg-checkpoint-700"
                >
                  {isCloning ? 
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Cloning...</> : 
                    'Clone Gateway'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="networking">Networking</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <div className="mt-1">{gateway.name}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <div className="mt-1">{gateway.type}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">IP Address</Label>
                <div className="mt-1">{gateway.ipv4_address}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">SIC State</Label>
                <div className="mt-1">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      gateway.sic_state === "communicating" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {gateway.sic_state || "Unknown"}
                  </span>
                </div>
              </div>
              {gateway.version && (
                <div>
                  <Label className="text-sm font-medium">Version</Label>
                  <div className="mt-1">{gateway.version}</div>
                </div>
              )}
              {gateway.os_name && (
                <div>
                  <Label className="text-sm font-medium">Operating System</Label>
                  <div className="mt-1">{gateway.os_name}</div>
                </div>
              )}
              {gateway.hardware && (
                <div>
                  <Label className="text-sm font-medium">Hardware</Label>
                  <div className="mt-1">{gateway.hardware}</div>
                </div>
              )}
              {gateway.domain && (
                <div>
                  <Label className="text-sm font-medium">Domain</Label>
                  <div className="mt-1">{gateway.domain.name}</div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="networking" className="space-y-4">
            <h3 className="text-lg font-medium">Network Interfaces</h3>
            {gateway.interfaces && gateway.interfaces.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Network Mask</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gateway.interfaces.map((iface, index) => (
                      <TableRow key={index}>
                        <TableCell>{iface.name}</TableCell>
                        <TableCell>{iface.ipv4_address || 'N/A'}</TableCell>
                        <TableCell>{iface.ipv4_mask_length || 'N/A'}</TableCell>
                        <TableCell>{iface.interface_type || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-muted-foreground">No interface information available</div>
            )}
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium mb-4">Advanced Properties</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(gateway)
                  .filter(([key]) => !['name', 'type', 'ipv4_address', 'sic_state', 'version', 'os_name', 'hardware', 'domain', 'interfaces', 'uid'].includes(key))
                  .map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-sm font-medium">{key.replace(/_/g, ' ')}</Label>
                      <div className="mt-1">
                        {typeof value === 'object' 
                          ? JSON.stringify(value) 
                          : String(value)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Gateway UID: {gateway.uid}
      </CardFooter>
    </Card>
  );
};

// Import Table components for interfaces
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default GatewayDetail;
