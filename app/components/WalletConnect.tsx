'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Wallet, ExternalLink, CheckCircle } from 'lucide-react';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      onConnect(address);
    } else if (!isConnected) {
      onDisconnect();
    }
  }, [isConnected, address, onConnect, onDisconnect]);

  const handleConnect = async (connector: any) => {
    setIsConnecting(true);
    try {
      await connect({ connector });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-accent" />
            </div>
          </div>
          <CardTitle className="text-lg">Wallet Connected</CardTitle>
          <CardDescription>Base network ready for transactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Wallet className="h-4 w-4 text-muted" />
            <code className="text-sm bg-muted px-2 py-1 rounded">
              {formatAddress(address)}
            </code>
            <a
              href={`https://basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="flex justify-center">
            <Badge variant="outline" className="text-accent border-accent">
              ✓ Base Network
            </Badge>
          </div>

          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect a Base-compatible wallet to enable micro-transactions and boosts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => handleConnect(connector)}
            disabled={isConnecting || isPending}
            className="w-full"
            variant="outline"
          >
            {isConnecting || isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect {connector.name}
              </>
            )}
          </Button>
        ))}

        <div className="text-xs text-muted-foreground text-center mt-4">
          Supports MetaMask, Coinbase Wallet, and other Base-compatible wallets
        </div>
      </CardContent>
    </Card>
  );
}
