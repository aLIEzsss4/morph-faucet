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

export const morphSepolia = /*#__PURE__*/ defineChain({
  id: 2710,
  name: 'Morph Sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  // @ts-ignore
  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.morphl2.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Morph Testnet Explorer',
      url: 'https://explorer-testnet.morphl2.io',
      // @ts-ignore
      apiUrl: 'https://explorer-api-testnet.morphl2.io/api',
    },
  },
  testnet: true,
  contracts:{
    contract:{
      address:'0x319A7fd1a83b06105Ccfc483Ee0E20fAd65032Fd'
    }
  }
})



const walletClient = createWalletClient({
  chain: morphSepolia,
  transport: http(),
});


const account = privateKeyToAccount(process.env.OWNER_PRIVATE_KEY as Address);


type Data = {
  message: string;
  url?: string;
};

type Address = `0x${string}`;

const amount = parseEther(process.env.Ether.toString() as string );

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
      // @ts-ignore
      address: morphSepolia.contracts.contract.address,
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
        // @ts-ignore
        url: morphSepolia.blockExplorers.default.url + "/tx/" + tx,
      });
  } catch (error) {
    res.status(400).json({
      message: (error as any).details as string,
    });
  }
}
