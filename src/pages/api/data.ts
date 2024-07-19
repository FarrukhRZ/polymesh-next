import { LocalSigningManager } from "@polymeshassociation/local-signing-manager";
import { Polymesh } from "@polymeshassociation/polymesh-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const address: string = req.query.address as string;
    console.log(address);
    const signingManager = await LocalSigningManager.create({
      accounts: [
        {
          mnemonic:
            "forest end mail art wish leave truth else ignore royal knife river", // most mnemonics are 12 words
        },
      ],
    });

    const polyClient = await Polymesh.connect({
      nodeUrl: "wss://mainnet-rpc.polymesh.network/",
      signingManager,
    });

    const acc = await polyClient.accountManagement.getAccount({
      address,
    });

    const nonce = await acc.getCurrentNonce();
    const balance = await acc.getBalance();

    console.log(
      "total",
      balance.total.toString(),
      "free",
      balance.free.toString(),
      "locked",
      balance.locked.toString()
    );
    console.log("txCount", nonce.toString());

    res.status(200).json({
      response: {
        tBalance: balance.total.toString(),
        fBalance: balance.free.toString(),
        lBalance: balance.locked.toString(),
        nonce: nonce.toString(),
      },
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

//   const assetsPage = await polyClient.assets.get({ size: new BigNumber(20) });
//   const balance = await polyClient.accountManagement.getAccountBalance({ account: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"});

//   const txHistory = await acc.getTransactionHistory();
//   console.log('txHistory', txHistory);
