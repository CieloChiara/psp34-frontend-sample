import { useEffect, useState } from "react";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ContractPromise } from '@polkadot/api-contract';
import abi from './metadata.json';
import axios from "axios";
import { render } from "react-dom";

import type { Bytes, Compact, DoNotConstruct, Enum, Int, Null, Option, Struct, U8aFixed, UInt, Vec, u16, u32, u64, u8 } from '@polkadot/types-codec';
import { formatNumber, numberToU8a, hexToU8a, isHex, u8aToString, stringToU8a } from '@polkadot/util';

const Home = () => {
  const subScanBaseUri = "https://shibuya.subscan.io/account/";

  const [block, setBlock] = useState(0);
  const [lastBlockHash, setLastBlockHash] = useState("");
  //const [blockchainUrl, setBlockchainUrl] = useState("wss://rpc.shibuya.astar.network");
  const [blockchainUrl, setBlockchainUrl] = useState("wss://shiden.api.onfinality.io/public-ws");

  const [actingChain, setActingChain] = useState("");
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [actingAddress, setActingAddress] = useState("");
  const [api, setApi] = useState<any>();

  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenURI, setTokenURI] = useState("");

  const [result, setResult] = useState("");
  const [gasConsumed, setGasConsumed] = useState("");
  const [outcome, setOutcome] = useState("");
  
  const [tokenJson, setTokenJson] = useState("");
  const [tokenImageUri, setTokenImageUri] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [subScanUri, setSubScanUri] = useState(subScanBaseUri);

  const extensionSetup = async () => {
    const { web3Accounts, web3Enable } = await import(
      "@polkadot/extension-dapp"
    );
    const extensions = await web3Enable("Polk4NET");
    if (extensions.length === 0) {
      return;
    }
    const account = await web3Accounts();
    setAccounts(account);
  };

  useEffect(() => {
    setup();
  });

  async function getTokenURI() {
    const gasLimit = 3000 * 1000000;
    const value = 0;
    if (contractAddress == "") {
      
    }
    
    //const tid: u32 = numberToU32;
    //const tid: Uint8Array = numberToU8a(1);

    const contract = new ContractPromise(api, abi, contractAddress);
    const {gasConsumed, result, output} = 
      await contract.query.tokenUri(contractAddress, {value: 0, gasLimit: -1}, 0);
    
    //setTokenURI(tokenId);
    setGasConsumed(gasConsumed.toHuman().toString());
    setResult(JSON.stringify(result.toHuman()));

    setOutcome(output.toHuman().toString());
    const url = output.toHuman().toString();

    axios.get(url).then(res => {
      setTokenJson(res.data.image.toString());
      setTokenImageUri(res.data.image.toString());
      setTokenName(res.data.name.toString());
    });

    setSubScanUri(subScanBaseUri + contractAddress);

  };

  const setup = async () => {
    const wsProvider = new WsProvider(blockchainUrl);
    const api = await ApiPromise.create({ provider: wsProvider });
    await api.rpc.chain.subscribeNewHeads((lastHeader) => {
      setBlock(lastHeader.number.toNumber());
      setLastBlockHash(lastHeader.hash.toString());
    });
    setApi(api);
    //await extensionSetup();
    //setContractAddress('W2i3x5RUvxH1AiYvzZsHKqaV4PCZ9M3DP8EjQkSmXqTJcRQ');    
  };

  return (
    <>
      <div className="text-center">
        <div className="p-3 m-3 text-3xl">NFTViewer Test</div>

        <div className="p-3 mt-5 m-auto border-1 w-11/12 border border-gray-500">
          <div className="p-2 mb-0 text-xl">Select blockchain</div>
          <select
            className="p-3 m-3 mt-0 border-2 border-green-500"
            onChange={(event) => {
              console.log(event);
              setActingChain(event.target.value);
              setBlockchainUrl((event.target.value));
              setup();
            }}
          >
              <option key="wss://shiden.api.onfinality.io/public-ws" value="wss://shiden.api.onfinality.io/public-ws">Shiden</option>
              <option key="wss://rpc.shibuya.astar.network" value="wss://rpc.shibuya.astar.network">Shibuya</option>
              <option key="ws://127.0.0.1:9944" value="ws://127.0.0.1:9944">Local</option>
              <option key="wss://astar-collator.cielo.works:11443" value="wss://astar-collator.cielo.works:11443">Custom</option>
          </select>

          <div className="p-2 m-2">Current Blockchain URL: {blockchainUrl}</div>
          <div className="p-1 m-1">Block: {block}</div>
          <div className="p-1 m-auto w-11/12 break-all">Last block hash: {lastBlockHash}</div>
        </div>

        <select
          className="p-3 m-3 border-2 border-green-500 hidden"
          onChange={(event) => {
            console.log(event);
            setActingAddress(event.target.value);
          }}
        >
          {accounts.map((a) => (
            <option key={a.address} value={a.address}>
              [{a.meta.name}]
            </option>
          ))}
        </select>
        </div>

        <div className="text-center mt-5">
          <button disabled={!contractAddress}
            className="bg-green-900 hover:bg-green-800 text-white rounded px-4 py-2"
            onClick={getTokenURI}
          >{contractAddress ? 'View NFT' : 'Enter ContractAddress'}</button>
          <input
            className="p-2 m-2 border-2"
            onChange={(event) => setContractAddress(event.target.value)}
            placeholder="ContractAddress"
          />
          <input
            className="p-2 m-2 border-2 w-20"
            onChange={(event) => setTokenId(event.target.value)}
            placeholder="TokenID"
          />
        </div>

        <div className="text-center">
          <div>
            <img className="p-2 m-auto w-64" src={tokenImageUri}></img>
            <p className="p-1 m-1 text-xl">{tokenName}</p>
            <p className={contractAddress ? "m-1" : "hidden"}><a target="_blank" rel="noreferrer" href={subScanUri}>Show on Subscan (Shibuya)</a></p>
          </div>
        </div>

        <div className="p-2 mt-5 m-auto border-1 w-11/12 border border-gray-500">
          <div className="hidden p-3 m-3">TokenURI: {tokenURI}</div>
          <p className="p-1 m-1 hidden">Result: {result}</p>
          <p className="p-1 m-1 break-all">MetadataUri: {outcome}</p>
          <p className="p-1 m-1 hidden">Gas consumed: {gasConsumed}</p>
          <p className="p-1 m-1 break-all" >ImageUri: {tokenJson}</p>
          <p className="p-1 m-1">TokenId: {tokenId}</p>
        </div>
        <div className="p-2 m-auto mb-5 border-1 w-11/12 border border-gray-500">
          <h3 className="m-1 text-xl text-center">Contracts (Shibuya)</h3>
          <p className="m-1 break-all">CieloNFT: a1YGBqnLkLYkW3QfGWGn7XVQMGurxY5R9yYBTv8RHa537e1</p>
          <p className="m-1 break-all">PiyoNFT: Y1GKyffZjEbQghjoABVhLLenkr94nW6qpk5b5kCTw6wvBP9</p>
          <h3 className="m-1 text-xl text-center">Contracts (My LocalCollator)</h3>
          <p className="m-1 break-all">CieloNFT: bKF9cww361bvu2qwf9hy22WM3m4Md58qukaHQxt8F5SvdxZ</p>
          <p className="m-1 break-all">PiyoNFT: b1nAeT4AL3N9T6cXiTWjwsJmT4xAvTtcW4mqzy7pA1vwDUY</p>
        </div>
    </>
  );
};


export default Home;