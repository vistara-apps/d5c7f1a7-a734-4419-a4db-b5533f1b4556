import { createPublicClient, createWalletClient, custom, http, formatEther, parseEther } from 'viem';
import { base } from 'wagmi/chains';

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

// Get wallet balance
export async function getBalance(address: `0x${string}`): Promise<string> {
  try {
    const balance = await publicClient.getBalance({ address });
    return formatEther(balance);
  } catch (error) {
    console.error('Failed to get balance:', error);
    return '0';
  }
}

// Send micro-transaction
export async function sendMicroTransaction(
  from: `0x${string}`,
  to: `0x${string}`,
  amount: string // in ETH
): Promise<{ hash: string } | null> {
  try {
    // This would require a connected wallet client
    // For now, return mock transaction hash
    const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    return { hash: mockHash };
  } catch (error) {
    console.error('Failed to send transaction:', error);
    return null;
  }
}

// Estimate gas for transaction
export async function estimateGas(
  from: `0x${string}`,
  to: `0x${string}`,
  amount: string
): Promise<string> {
  try {
    const gasEstimate = await publicClient.estimateGas({
      account: from,
      to,
      value: parseEther(amount),
    });
    return gasEstimate.toString();
  } catch (error) {
    console.error('Failed to estimate gas:', error);
    return '21000'; // Default gas limit
  }
}

// Check if address is valid
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Format address for display
export function formatAddress(address: string): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Get transaction URL on BaseScan
export function getTransactionUrl(hash: string): string {
  return `https://basescan.org/tx/${hash}`;
}

// Get address URL on BaseScan
export function getAddressUrl(address: string): string {
  return `https://basescan.org/address/${address}`;
}

// Micro-transaction amounts (in ETH)
export const MICRO_TRANSACTION_AMOUNTS = {
  PROFILE_BOOST: '0.001', // ~$0.03 at $30/ETH
  TEMPLATE_PURCHASE: '0.005', // ~$0.15 at $30/ETH
  COLLABORATION_REWARD: '0.01', // ~$0.30 at $30/ETH
} as const;

// Check if user can afford transaction
export async function canAffordTransaction(
  address: `0x${string}`,
  amount: string
): Promise<boolean> {
  try {
    const balance = await getBalance(address);
    const balanceWei = parseEther(balance);
    const amountWei = parseEther(amount);

    // Add gas buffer (assume 0.0001 ETH for gas)
    const gasBuffer = parseEther('0.0001');
    const totalCost = amountWei + gasBuffer;

    return balanceWei >= totalCost;
  } catch (error) {
    console.error('Failed to check affordability:', error);
    return false;
  }
}

