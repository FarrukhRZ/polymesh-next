"use client";
import { BrowserExtensionSigningManager } from "@polymeshassociation/browser-extension-signing-manager";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0)
  // const [polyClient, setPolyClient] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState({total: null, free: null, locked: null});
  const [txCount, setTxCount] = useState(null);

  const connectWallet = async () => {
    const signingManager = await BrowserExtensionSigningManager.create({appName: "Polymesh App"});
    signingManager.setSs58Format(12);
    const accounts = await signingManager.getAccounts();
    console.log("accounts", accounts);
    setAccount(accounts[0]);
  }

  const getData = async () => {
    const response = await fetch(`/api/data?address=${account}`);
    const data = await response.json();
    console.log(data);
    setBalance({total: data.response.tBalance, free: data.response.fBalance, locked: data.response.lBalance});
    setTxCount(data.response.nonce);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <button 
        onClick={connectWallet}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
      >
        Connect Wallet
      </button>
      <div className="text-center bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">Account</h2>
        <p className="mb-4 text-gray-600 break-words">{account}</p>
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">Balance</h2>
        <p className="text-gray-600">Total: {balance?.total}</p>
        <p className="text-gray-600">Free: {balance?.free}</p>
        <p className="text-gray-600 mb-4">Locked: {balance?.locked}</p>
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">Transaction Count</h2>
        <p className="mb-4 text-gray-600">{txCount}</p>
        <button 
          onClick={getData}
          className="inline-block px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition duration-300"
        >
          Get Data
        </button>
      </div>
    </main>
  );
}
