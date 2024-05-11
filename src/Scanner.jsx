import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Web3 from 'web3';
import './Scanner.css';
import axios from 'axios';
import { IoCloseCircle } from "react-icons/io5";
import { IoQrCodeSharp } from "react-icons/io5";

function Scanner() {
    const [scannedqr, setScannerQr] = useState("");
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [connected, setConnected] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [eventDetails, setEventDetails] = useState(null);
    const [EveDetails, setEveDetails] = useState([]);
    const [personDetails, setPersonDetails] = useState({
        bool: true,
    });
    const [error, setError] = useState(null);
    const [btn, setBtn] = useState(true);
    const [ValidQr, setValidQr] = useState(false);
    const YOUR_CONTRACT_ADDRESS = "your_contract_address";
    const YourContractABI = "your_contract_abi";
    useEffect(() => {
        const initWeb3 = async () => {
            if (!connected) {
                setBtn(false);
            }
            else {
                setBtn(true);
            }
            if (window.ethereum) {
                try {
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        setConnected(true);
                    }
                } catch (error) {
                    setError("Failed to initialize web3");
                }
            } else {
                setError("MetaMask not installed");
            }
        };

        initWeb3();

    }, []);

    const handleConnectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAccount = accounts[0];
            setAccount(userAccount);
            setBtn(true);
            setConnected(true);
        } catch (error) {
            setError("Failed to connect wallet");
        }
    };
    const handleCloseModal = () => {
        setScannerQr("");
        setShowModal(false);
    };
    async function checkValid(userhash) {
        try {
            if (!web3) {
                throw new Error('Web3 not initialized');
            }

            const contract = new web3.eth.Contract(YourContractABI, YOUR_CONTRACT_ADDRESS);
            userhash = userhash.replace(/"/g, "");
            const result = await contract.methods.getParticipantDetails(userhash).call();
            if (!result || !result.eventId) {
                setShowModal(true);
                setValidQr(false);
                return;
            }
            const r = await axios.post("http://localhost:5000/eventfind", { eventid: result.eventId });
            setEveDetails(r.data);

            const q = await axios.post("http://localhost:5000/personfind", { participantid: result.participantAddress });
            setPersonDetails(q.data);

            setScannerQr("");
            if (personDetails.bool === true) {
                const v = await axios.post("http://localhost:5000/valid", { participantid: result.participantAddress, eventid: result.eventId });
                setPersonDetails(v.data);
                setValidQr(true);
                const event = await contract.methods.getEventDetails(result.eventId).call();
                setEventDetails(event);
                setShowModal(true);
            }
            
            if (personDetails.bool === "false") {
                setShowModal(true);
                setValidQr(false);
            }
        } catch (error) {
            setError("Failed to check validity");
        }
    }


    async function scan() {

        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 400,
                height: 400,
            },
            fps: 5,
        });

        async function success(res) {
            scanner.clear();
            setScannerQr(res);
            if (res) {
                await checkValid(res);
            }

        }

        function error(err) {
            setScannerQr("");
        }

        scanner.render(success, error);
    }
    return (
        <>
            <div className="header">
                <div className="head-sub">
                    <IoQrCodeSharp className="logo" />
                    <h1>Scan App</h1>
                </div>
                <div className="connect">
                    <button className="connect-button" onClick={handleConnectWallet}>
                        {connected ? "Connected" : "Connect to Wallet"}
                    </button>
                </div>
            </div>
            <div className="head-title">
                <h1>QR scanning for Event Pass validation</h1>
            </div>
            <p>{showModal}</p>

            {error && <p className="error">{error}</p>}
            {(scannedqr === "" && <div id="reader"><button className="scan-button" onClick={scan} title={btn.text}>Click to Scan</button></div>)}
            {showModal && ValidQr && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Event Details</h2>
                            <IoCloseCircle className="close" onClick={handleCloseModal} />
                        </div>
                        <p><span className="label">Email:</span> {personDetails.email}</p>
                        <p><span className="label">Name:</span> {eventDetails.name}</p>
                        <p><span className="label">Location:</span> {eventDetails.location}</p>
                        <p><span className="label">No.of Persons:</span> {personDetails.person}</p>
                        <p><span className="label">Date:</span> {EveDetails.date}</p>
                    </div>
                </div>
            )}
            {showModal && !ValidQr && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Invalid QR Code</h2>
                            <IoCloseCircle className="close" onClick={handleCloseModal} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Scanner;
