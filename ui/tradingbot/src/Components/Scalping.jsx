import React, { useEffect, useState } from 'react'
import axios from '../Helpers/Axios'

function Scalping() {
    const [feed, setFeed] = useState(null);
    let [scalpEntryPrice, setScalpEntryPrice] = useState(0)
    let [scalpStrikePrice, setScalpStrikePrice] = useState(0)
    let [nifty, setNifty] = useState(20000)
    let [check, setCheck] = useState(0)
    let [scalp, setScalp] = useState(null)
    let [firstEntry, setFirstEntry] = useState(true)
    let [expiry, setExpiry] = useState('01FEB24')
    let [scalpCheckInterval, setScalpCheckInterval] = useState(null)

    useEffect(() => {
        if (nifty - scalpEntryPrice >= -1 && nifty - scalpEntryPrice <= 1) {
            stopScalp();
            console.log('Scalping initiated!');
            setScalpCheckInterval(setInterval(scalpCheck, 500))
        }
        else { console.log('Waiting for price to reach the entry price!'); }
    }, [check])

    // ----- Scalping -----//
    function startScalp() {
        setScalp(setInterval(scalping, 500))
    }
    function stopScalp() {
        setScalp(clearInterval(scalp))
    }
    function scalping() {
        setCheck(check = check + 1)
    }
    // ----- Scalping end -----//

    // ----- Price Feed -----//
    function startFeed() {
        setFeed(setInterval(PriceFeed, 500));
    }
    function stopFeed() {
        setFeed(clearInterval(feed))
        console.log('Price Feed Stopped ❌');
    }
    function PriceFeed() {
        axios.get('/pricefeednifty')
            .then((res) => {
                setNifty(res.data['lp'])
            })
            .catch((err) => {
                console.log(err);
            })
    }
    // ----- Price Feed End -----//

    // ----- Go Long or Short -----//
    function goLong() {
        console.log('Entering at - ' + nifty);
        axios.post('/placescalporderlong', { 'ce': 'NIFTY' + expiry + 'C' + scalpStrikePrice,'pe': 'NIFTY' + expiry + 'P' + scalpStrikePrice })
            .then((res) => {
                // console.log(res);
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    console.log('New order placed at - ' + nifty);
                }
                else {
                    alert('Order placing error❗❌')
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    function goShort() {
        console.log('Entering at - ' + nifty);
        axios.post('/placescalpordershort', { 'ce': 'NIFTY' + expiry + 'C' + scalpStrikePrice,'pe': 'NIFTY' + expiry + 'P' + scalpStrikePrice })
            .then((res) => {
                // console.log(res);
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    console.log('New order placed at - ' + nifty);
                }
                else {
                    alert('Order placing error❗❌')
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    // ----- end ----- //

    // -----Scalping check ----- //
    function startScalpCheck(){
        console.log('Scalping initiated!');
        setScalpCheckInterval(setInterval(scalpCheck, 500))
    }
    function stopScalpCheck(){
        console.log('Scalping terminated!');
        stopScalp();
        setScalpCheckInterval(clearInterval(scalpCheckInterval))
    }
    function scalpCheck() {
        if (nifty > scalpEntryPrice) {
            if (firstEntry) {
                axios.post('/placescalporder', { 'ce': 'NIFTY' + expiry + 'C' + scalpStrikePrice })
                    .then((res) => {
                        // console.log(res);
                        if (res.data[0].stat == 'Ok') {
                            console.log('New order placed at - ' + nifty);
                        }
                        else {
                            alert('Order placing error❗❌')
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            else {
                setFirstEntry(false);
                goLong();
            }
        }
        else {
            if (firstEntry) {
                axios.post('/placescalporder', { 'ce': 'NIFTY' + expiry + 'C' + scalpStrikePrice })
                    .then((res) => {
                        // console.log(res);
                        if (res.data[0].stat == 'Ok') {
                            console.log('New order placed at - ' + nifty);
                        }
                        else {
                            alert('Order placing error❗❌')
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            else {
                setFirstEntry(false);
                goShort();
            }
        }
    }
    // ----- Scalping check end ----- //

    // ----- Kill Switch ----- //
    function killSwitch(){
        console.log('Killing all trades');
        stopScalpCheck();
        stopScalp();
        stopFeed();
    }
    // ----- Kill Switch End ----- //

    return (
        <div>
            <div>Scalping</div>
            <div>
                <button onClick={startFeed}>Start Price Feed</button>
                <button onClick={stopFeed}>Stop Price Feed</button>
            </div>
            <div>Nifty : {nifty}</div>
            <div>
                <div>
                    <input type="text" placeholder='Entry price' onChange={(e) => { setScalpEntryPrice(e.target.value); setScalpStrikePrice(Math.round(e.target.value / 50) * 50) }} />
                </div>
                <button onClick={startScalp}>Start Scalping</button>
                <button onClick={stopScalp}>Stop Waiting</button>
                <button onClick={stopScalpCheck}>Stop Scalping</button>
                <button onClick={killSwitch}>Kill Everything</button>
            </div>
        </div>
    )
}

export default Scalping