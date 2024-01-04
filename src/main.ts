import { SquidAddress } from './constants/contractAddress';
import { Address, Chain, WalletClient, toHex } from 'viem';
import {
  InjectedConnector,
  configureChains,
  createConfig,
  sepolia,
  connect,
  disconnect,
} from '@wagmi/core';
import { publicProvider } from '@wagmi/core/providers/public';
import { getWalletClient } from '@wagmi/core';
import { getAccount } from '@wagmi/core';

const api = 'https://api-squid-sepolia.squid.tw';

function callStatus() {
  return fetch(`${api}/game`).then((res) => res.json());
}

function callPlayerInfo(address: string) {
  return fetch(`${api}/player?address=${address}`).then((res) => res.json());
}

function mintWithEth(client: WalletClient, { chain }: { chain: Chain }) {
  const callData = toHex(JSON.stringify({ p: 'OIG', op: 'mint', amt: 3000 }));
  return client.sendTransaction({
    data: callData,
    chain,
    to: SquidAddress[chain.id] as Address,
    value: BigInt(1000000000000000),
    account: client.account!,
  });
}

function mint(client: WalletClient, { chain }: { chain: Chain }) {
  const callData = toHex(JSON.stringify({ p: 'OIG', op: 'mint', amt: 300 }));
  return client.sendTransaction({
    data: callData,
    chain,
    to: SquidAddress[chain.id] as Address,
    account: client.account!,
  });
}

function hatch(
  client: WalletClient,
  { chain, amt }: { chain: Chain; amt: number }
) {
  const callData = toHex(JSON.stringify({ p: 'OIG', op: 'hetch', amt }));
  return client.sendTransaction({
    data: callData,
    chain,
    to: SquidAddress[chain.id] as Address,
    account: client.account!,
  });
}

function transfer(
  client: WalletClient,
  { chain, to }: { chain: Chain; to: string }
) {
  const callData = toHex(JSON.stringify({ p: 'OIG', op: 'transfer', to }));
  return client.sendTransaction({
    data: callData,
    chain,
    to: SquidAddress[chain.id] as Address,
    account: client.account!,
    value: 0n,
  });
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

function connectToWallet() {
  connect({
    connector: new InjectedConnector(),
    chainId: sepolia.id
  });
}

function disConnectWallet() {
  disconnect()
}

function getWalletInfo() {
  return getAccount()
    .address
}

export default {
  callStatus,
  callPlayerInfo,
  mintWithEth,
  mint,
  hatch,
  transfer,
  connectToWallet,
  disConnectWallet,
  getWalletInfo,
}