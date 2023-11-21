import type { NextApiRequest, NextApiResponse } from "next";

import {
  createWalletClient,
  http,
  parseEther,
  defineChain,
  isAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { wagmiAbi } from "./_abi";

export const redstoneHoleSky = defineChain({
  id: 17001,
  name: "Redstone HoleSky",
  network: "holesky",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.holesky.redstone.xyz"],
      webSocket: ["wss://rpc.holesky.redstone.xyz/ws"],
    },
    public: {
      http: ["https://rpc.holesky.redstone.xyz"],
      webSocket: ["wss://rpc.holesky.redstone.xyz/ws"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.holesky.redstone.xyz" },
  },
  contracts: {
    contract: {
      address: "0xE36D7af621241a91B89D22d0ffEE0C464A67f7FC",
      blockCreated: 649879,
    },
  },
});

const walletClient = createWalletClient({
  chain: redstoneHoleSky,
  transport: http(),
});

const account = privateKeyToAccount(process.env.OWNER_PRIVATE_KEY as Address);

type Data = {
  message: string;
  url?: string;
};

type Address = `0x${string}`;

const amount = parseEther("0.01");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const recipient: Address = req.query.address as Address;

  if (recipient === undefined) {
    res.status(400).json({
      message: "Address is undefined!",
    });
  } else if (!isAddress(recipient)) {
    res.status(400).json({
      message: "Invalid address!",
    });
  }

  try {
    const tx = await walletClient.writeContract({
      address: redstoneHoleSky.contracts.contract.address,
      abi: wagmiAbi,
      functionName: "sendFunds",
      args: [recipient, amount],
      account,
    });
    console.log(tx);
    res
      .status(200)
      .json({
        message: "Success!",
        url: redstoneHoleSky.blockExplorers.default.url + "/tx/" + tx,
      });
  } catch (error) {
    res.status(400).json({
      message: (error as any).details as string,
    });
  }
}
