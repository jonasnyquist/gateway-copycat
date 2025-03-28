
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { Gateway } from '../services/gatewayService';
import { useGatewayClone, CloneGatewayParams } from '../services/gatewayCloneService';

interface GatewayCloneFormProps {
  gateway: Gateway;
  onCloneSuccess: () => void;
}

const GatewayCloneForm = ({ gateway, onCloneSuccess }: GatewayCloneFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CloneGatewayParams>({
    name: `${gateway.name}-copy`,
    ipv4Address: '',
    comment: `Clone of ${gateway.name}`
  });

  const { cloneGateway } = useGatewayClone();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await cloneGateway(gateway, formData);
      if (success) {
        setOpen(false);
        onCloneSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <Copy className="h-4 w-4" />
          Clone Gateway
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Clone Gateway</DialogTitle>
          <DialogDescription>
            Create a new gateway based on {gateway.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="New gateway name"
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="ipv4Address">IPv4 Address</Label>
            <Input
              id="ipv4Address"
              name="ipv4Address"
              value={formData.ipv4Address}
              onChange={handleChange}
              placeholder="192.168.1.1"
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Gateway description"
              rows={3}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-checkpoint-600 hover:bg-checkpoint-700" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cloning..." : "Clone Gateway"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GatewayCloneForm;
