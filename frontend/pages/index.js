import { BankAccountABI, BankAccountAddress } from '@/constants'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import { useEffect, useState, useContext} from "react";
import styles from "../styles/Home.module.css";
import { Inter } from "next/font/google";
import { ethers } from "ethers"

import { useAccount, useBalance, useContractRead } from "wagmi";
import { waitForTransaction, writeContract } from "wagmi/actions";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {

  const [bankOwnerAddress, setBankOwnerAddress] = useState("");
  const [balance, setBalance] = useState();

  const [amountToDeposit, setAmountToDeposit] = useState("");
  const [amountToWithdraw, setAmountToWithdraw] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");

  const { address, isConnected } = useAccount();

  const ownerAddressTemp = useContractRead({
    abi: BankAccountABI,
    address: BankAccountAddress,
    functionName: "owner",
  });

  const balanceTemp = useBalance({
    address: BankAccountAddress
  });

  useEffect(() => {
    fetchBankAccountOwner();
  }, []);
  
  useEffect(() => {
    fetchBankAccountBalance();
  }, []);
  
  const fetchBankAccountBalance = async () => {
    try {
      const balanceData = await balanceTemp.data.formatted;
      setBalance(balanceData);
    } catch (error) {
      console.error("Error fetching bank account balance:", error);
    }
  }

  const fetchBankAccountOwner = async () => {
    try {
      setBankOwnerAddress(ownerAddressTemp.data);
    } catch (error) {
      console.error("Error fetching bank account owner:", error);
    }
  }
  

  async function depositEther() {
    
    try {
      const amountToDepositInEthers = ethers.parseEther(amountToDeposit);
  
      const transaction = await writeContract({
        address: BankAccountAddress,
        abi: BankAccountABI,
        functionName: "deposit",
        value: amountToDepositInEthers
      });

      await waitForTransaction(transaction);
    } catch (error) {
      console.error(error)
      window.alert(error);
    }

  }

  async function withdrawAllEther() {

    try {

      const tx = await writeContract ({
        address: BankAccountAddress,
        abi: BankAccountABI,
        functionName: "withdrawAll",
        args: []
      });

      await waitForTransaction(tx);
    } catch (error) {
      console.log(error);
      window.alert(error);
    }

  }

  async function withdrawEther() {

    try {

      const amountToWithdrawInEthers = ethers.parseEther(amountToWithdraw);

      const tx = await writeContract ({
        address: BankAccountAddress,
        abi: BankAccountABI,
        functionName: "withdraw",
        args: [amountToWithdrawInEthers]
      });

      await waitForTransaction(tx);
    } catch (error) {
      console.log(error);
      window.alert(error);
    }

  }

  async function sendTo() {
    
    try {
      const amountToDepositInEthers = ethers.parseEther(amountToSend);
  
      const transaction = await writeContract({
        address: BankAccountAddress,
        abi: BankAccountABI,
        functionName: "sendTo",
        args:[receiverAddress, amountToDepositInEthers]
      });

      await waitForTransaction(transaction);
    } catch (error) {
      console.error(error)
      window.alert(error);
    }

  }

  const handleDeposit = (event) => {
    setAmountToDeposit(event.target.value);
  };

  const handleWithdraw = (event) => {
    setAmountToWithdraw(event.target.value);
  };

  const handleSend = (event) => {
    setAmountToSend(event.target.value);
  };

  const handleReceiveAddress = (event) => {
    setReceiverAddress(event.target.value);
  };

  if (!isConnected)
    return (
      <div>
          <ConnectButton label="Sign in" accountStatus="avatar" showBalance={false}/>
      </div>
    );

  if(bankOwnerAddress == address)
    return (
      <div className={styles.container}>
        <Head>
          <title>Smart Bank | Home</title>
          <meta name="description" content="Welcome to my app" />
        </Head>
        <div className={styles.navbar}>
          <h1 className={styles.title}>Smart Bank</h1>
          <div className={styles.buttonContainer}>
            <ConnectButton label="Sign in" accountStatus="avatar" showBalance={true}/>
          </div>
        </div>

        <div className={styles.content}>
          
          {bankOwnerAddress ? (
            <div>Bank Account Owner: {bankOwnerAddress}</div>
          ) : (
            <div>Owner Address not showing up...</div>
          )}

          <br/>

          {balance ? (
            <div>Bank Account Balance: {balance.toString()} ethers</div>
          ) : (
            <div>Balance not showing up...</div>
          )}
          
          <br/>

          <div className='buttonContainer'>
            Deposit: <input type="number" value={amountToDeposit} onChange={handleDeposit}/>
            <button onClick={depositEther}>Confirm</button>
          </div>

          <br/>

          <div className='buttonContainer'>
            Withdraw All 
            <button onClick={withdrawAllEther}>Confirm</button>
          </div>
          
          <br/>
            
          Withdraw
          <input type="number" value={amountToWithdraw} onChange={handleWithdraw}/>
          <button onClick={withdrawEther}>Confirm</button>

          <br/>

          <div className='buttonContainer'>
            <h2>Send Ether:</h2>
            
            <div>Amount:</div>
            <input type="string" value={amountToSend} onChange={handleSend}/> 
            
            {/* 0xA947f4b3726264875c473b57CB38Acf10D64dC61 */}
            <div>Address:</div><input type="string" value={receiverAddress} onChange={handleReceiveAddress}/>
            <button onClick={sendTo}>Confirm</button>

          </div>

        </div>
      </div>
    );
  else {
    return (<div>You are not the owner of this account</div>);
  }
}

