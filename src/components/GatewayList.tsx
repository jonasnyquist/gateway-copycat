
import { useEffect, useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import { fetchGateways, Gateway } from '../services/gatewayService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RefreshCw, LogOut } from "lucide-react";
import { toast } from "sonner";

interface GatewayListProps {
  onSelectGateway: (gateway: Gateway) => void;
}

const GatewayList = ({ onSelectGateway }: GatewayListProps) => {
  const { serverUrl, sessionId, logout } = useApi();
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [filteredGateways, setFilteredGateways] = useState<Gateway[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadGateways = async () => {
    if (!sessionId || !serverUrl) return;
    
    setIsLoading(true);
    try {
      const data = await fetchGateways(serverUrl, sessionId);
      setGateways(data);
      setFilteredGateways(data);
    } catch (error) {
      toast.error("Failed to fetch gateways");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGateways();
  }, [sessionId, serverUrl]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGateways(gateways);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = gateways.filter(
        gateway => 
          gateway.name.toLowerCase().includes(term) || 
          gateway.ipv4_address.toLowerCase().includes(term)
      );
      setFilteredGateways(filtered);
    }
  }, [searchTerm, gateways]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gateway Objects</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={loadGateways} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search gateways..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGateways.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {isLoading 
                      ? "Loading gateways..." 
                      : "No gateways found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredGateways.map((gateway) => (
                  <TableRow 
                    key={gateway.uid}
                    onClick={() => onSelectGateway(gateway)}
                    className="cursor-pointer hover:bg-muted"
                  >
                    <TableCell>{gateway.name}</TableCell>
                    <TableCell>{gateway.ipv4_address}</TableCell>
                    <TableCell>{gateway.type}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gateway.sic_state === "communicating" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {gateway.sic_state || "Unknown"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GatewayList;
