
import { useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const LoginForm = () => {
  const { serverUrl, setServerUrl, login } = useApi();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login({ username, password, domain });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-checkpoint-700 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Gateway Manager</CardTitle>
        <CardDescription className="text-center">
          Connect to your Check Point Management Server
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="server-url">Server URL</Label>
            <Input 
              id="server-url"
              type="text" 
              placeholder="https://management-server.example.com" 
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="domain">Domain (Optional)</Label>
            <Input 
              id="domain"
              type="text" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-checkpoint-600 hover:bg-checkpoint-700" 
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Connect"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm text-gray-500">
        Secure connection to Check Point API
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
