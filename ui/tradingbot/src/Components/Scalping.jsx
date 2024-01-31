import React, { useEffect, useState } from 'react'
import axios from '../Helpers/Axios'
import expiryDates from '../utils/expiryDates.json'

function Scalping() {
    const [feed, setFeed] = useState(null);
    let [scalpEntryPrice, setScalpEntryPrice] = useState(0)
    let [scalpStrikePrice, setScalpStrikePrice] = useState(0)
    let [price, setPrice] = useState(20000)
    let [check, setCheck] = useState(0)
    let [check2, setCheck2] = useState(0)
    let [scalp, setScalp] = useState(null)
    let [entered, setentered] = useState(false)
    let [enteredLong, setEnteredLong] = useState(false)
    let [enteredShort, setEnteredShort] = useState(false)
    let [expiryData, setExpryData] = useState(expiryDates.data)
    let [expiry, setExpiry] = useState('29JAN24')
    let [index, setIndex] = useState('MIDCPNIFTY')
    let [qty, setQty] = useState(0)
    let [scalpCheckInterval, setScalpCheckInterval] = useState(null)
    let [tradeCheckInterval, setTradeCheckInterval] = useState(null)
    let [priceFeedLink, setPriceFeedLink] = useState('/pricefeednifty')
    // console.log(scalpEntryPrice);MIDCPNIFTY29JAN24C10725
    // console.log(index);
    // console.log(expiry);
    // console.log(qty);
    // console.log(priceFeedLink);
    useEffect(() => {
        if (price - scalpEntryPrice >= -1 && price - scalpEntryPrice <= 1) {
            stopScalp();
            console.log('Scalping initiated!');
            enterTrade();
            // let scalpCheckIntervalId = setInterval(scalpCheck, 1000)
            // setScalpCheckInterval(scalpCheckIntervalId)
            // setScalpCheckInterval(setInterval(scalpCheck, 500))
        }
        else { console.log('Waiting for price to reach the entry price!'); }
    }, [check])

    useEffect(() => {
        if (entered == true && enteredLong == true && scalpEntryPrice > price) {
            stopTradeCheck();
            goShort();
        }
        else if (entered == true && enteredShort == true && scalpEntryPrice < price) {
            stopTradeCheck();
            goLong();
        }
        else {
            // console.log('...');
            console.log('Monitoring trades...');
        }
    }, [check2])

    function tradeCheck() {
        setCheck2(check2 = check2 + 1);
    }
    function stopTradeCheck() {
        clearInterval(tradeCheckInterval);
        console.log('Trade monitor ended!');
    }
    function startTradeCheck() {
        let tradeCheckId = setInterval(tradeCheck, 300);
        setTradeCheckInterval(tradeCheckId);
    }
    // useEffect(()=>{
    //     if(scalpEntryPrice < nifty){
    //         setEnteredLong(true)
    //         setEnteredShort(false)
    //     }
    //     else{
    //         setEnteredLong(false)
    //         setEnteredShort(true)
    //     }
    // },[check2])

    // console.log(entered);
    // console.log(enteredLong);
    // console.log(enteredShort);

    // ----- Scalping -----//
    function startScalp() {
        let scalpIntervalId = setInterval(() => { setCheck(check = check + 1) }, 300);
        // setScalp(setInterval(scalping, 500))
        setScalp(scalpIntervalId);
    }
    function stopScalp() {
        clearInterval(scalp);
        console.log('Entry Check terminated!');
    }
    // function scalping() {
    //     setCheck(check = check + 1)
    // }
    // ----- Scalping end -----//

    // ----- Price Feed -----//
    function startFeed() {
        console.log('Price Feed Started!');
        let feedIntervalId = setInterval(PriceFeed, 500);
        setFeed(feedIntervalId);
        // setFeed(setInterval(PriceFeed, 500));
    }
    function stopFeed() {
        clearInterval(feed);
        console.log('Price Feed Stopped ❌');
    }
    function PriceFeed() {
        axios.get(priceFeedLink)
            .then((res) => {
                // console.log(res);
                setPrice(res.data['lp'])
            })
            .catch((err) => {
                console.log(err);
            })
    }
    // ----- Price Feed End -----//

    // ----- Go Long or Short -----//
    function goLong() {
        // stopTradeCheck();
        // console.log('Entering at - ' + nifty);
        axios.post('/placescalporderlong', { 'ce': index + expiry + 'C' + scalpStrikePrice, 'pe': index + expiry + 'P' + scalpStrikePrice, 'qty': qty })
            .then((res) => {
                // console.log(res);
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    console.log('Shifted to long at - ' + price);
                    setEnteredLong(true);
                    setEnteredShort(false);
                    startTradeCheck();
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
        // stopTradeCheck();
        // console.log('Entering at - ' + nifty);
        axios.post('/placescalpordershort', { 'ce': index + expiry + 'C' + scalpStrikePrice, 'pe': index + expiry + 'P' + scalpStrikePrice, 'qty': qty })
            .then((res) => {
                // console.log(res);
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    console.log('Shifted to short at - ' + price);
                    setEnteredShort(true);
                    setEnteredLong(false);
                    startTradeCheck();
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
    function startScalpCheck() {
        console.log('Scalping initiated!');
        // setScalpCheckInterval(setInterval(scalpCheck, 500))
    }
    function stopScalpCheck() {
        // stopScalp();
        clearInterval(scalp);
        clearInterval(scalpCheckInterval);
        console.log('Scalping terminated!');
        // setScalpCheckInterval(clearInterval(scalpCheckInterval))
    }
    function placeOrderCe() {
        if (entered == false && enteredLong == false && enteredShort == false) {
            axios.post('/placescalporderce', { 'ce': index + expiry + 'C' + scalpStrikePrice, 'qty': qty })
                .then((res) => {
                    console.log(res);
                    if (res.data.stat == 'Ok') {
                        console.log('New order placed at - ' + price);
                        setentered(true);
                        console.log(entered);
                        setEnteredLong(true);
                        console.log(enteredLong);
                        setEnteredShort(false);
                        console.log(enteredShort);
                    }
                    else {
                        alert('Order placing error❗❌')
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else if (enteredShort == true && enteredLong == false) {
            console.log('Closing short and Entering long!');
            goLong();
        }
        else {
            console.log('In trade...');
        }
    }
    function placeOrderPe() {
        if (entered == false && enteredLong == false && enteredShort == false) {
            setentered(true)
            axios.post('/placescalporderpe', { 'pe': index + expiry + 'P' + scalpStrikePrice, 'qty': qty })
                .then((res) => {
                    console.log(res);
                    if (res.data.stat == 'Ok') {
                        console.log('New order placed at - ' + price);
                        setentered(true);
                        console.log(entered);
                        setEnteredLong(false);
                        setEnteredShort(true);
                    }
                    else {
                        alert('Order placing error❗❌')
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else if (enteredShort == false && enteredLong == true) {
            console.log('Closing long and Entering short!');
            goShort();
        }
        else {
            console.log('In trade...');
        }
    }
    function scalpCheck() {
        if (price > scalpEntryPrice) {
            setentered(true);
            placeOrderCe();
            // if (entered == false && enteredLong == false && enteredShort == false) {
            //     axios.post('/placescalporderce', { 'ce': 'NIFTY' + expiry + 'C' + scalpStrikePrice })
            //         .then((res) => {
            //             console.log(res);
            //             if (res.data.stat == 'Ok') {
            //                 console.log('New order placed at - ' + nifty);
            //                 setentered(true);
            //                 console.log(entered);
            //                 setEnteredLong(true);
            //                 console.log(enteredLong);
            //                 setEnteredShort(false);
            //                 console.log(enteredShort);
            //             }
            //             else {
            //                 alert('Order placing error❗❌')
            //             }
            //         })
            //         .catch((err) => {
            //             console.log(err);
            //         })
            // }
            // else if (enteredShort == true && enteredLong == false) {
            //     console.log('Closing short and Entering long!');
            //     goLong();
            // }
            // else {
            //     console.log('In trade...');
            // }
        }
        else if (price < scalpEntryPrice) {
            setentered(true);
            placeOrderPe();
        }
        else {
            console.log('Waiting for trade...');
        }
        //     // setEnteredShort(false)
        //     if (entered == false) {
        //         if (enteredShort == false) {
        //             axios.post('/placescalporderce', { 'ce': 'NIFTY' + expiry + 'C' + scalpStrikePrice })
        //                 .then((res) => {
        //                     console.log(res);
        //                     if (res.data.stat == 'Ok') {
        //                         console.log('New order placed at - ' + nifty);
        //                         setentered(true);
        //                         setEnteredLong(true);
        //                         setEnteredShort(false);
        //                     }
        //                     else {
        //                         alert('Order placing error❗❌')
        //                     }
        //                 })
        //                 .catch((err) => {
        //                     console.log(err);
        //                 })
        //         }
        //         else {
        //             console.log();
        //         }
        //     }
        //     else if (!enteredLong) {
        //         console.log('Closing short and Entering long!');
        //         goLong();
        //         // setEnteredShort(false);
        //     }
        //     else {
        //         console.log('In trade...');
        //     }
        // }
        // else {
        //     if (entered) {
        //         setentered(false);
        //         if (!enteredLong) {
        //             axios.post('/placescalporderpe', { 'pe': 'NIFTY' + expiry + 'P' + scalpStrikePrice })
        //                 .then((res) => {
        //                     console.log(res);
        //                     if (res.data.stat == 'Ok') {
        //                         console.log('New order placed at - ' + nifty);
        //                         setEnteredShort(true)
        //                         setEnteredLong(false)
        //                     }
        //                     else {
        //                         alert('Order placing error❗❌')
        //                     }
        //                 })
        //                 .catch((err) => {
        //                     console.log(err);
        //                 })
        //         }
        //     }
        //     else if (!enteredShort) {
        //         console.log('Closing long and Entering short!');
        //         goShort();
        //     }
        //     else {
        //         console.log('In trade...');
        //         // goShort();
        //     }
    }

    // ----- Scalping check end ----- //

    // ----- Kill Switch ----- //
    function killSwitch() {
        stopScalp();
        clearInterval(scalp);
        stopScalpCheck();
        clearInterval(scalpCheckInterval);
        stopFeed();
        clearInterval(feed)
        clearInterval(tradeCheckInterval);
        console.log('Killed Everything ⚠');
        // axios.get('/exitallorders')
        // .then((res)=>{
        //     console.log(res);
        // })
        // .catch((err)=>{
        //     console.log(err);
        // })
    }
    // ----- Kill Switch End ----- //

    function enterTrade() {
        if (scalpEntryPrice < price) {
            axios.post('/placescalporderpe', { 'pe': index + expiry + 'P' + scalpStrikePrice, 'qty': qty })
                .then((res) => {
                    console.log(res);
                    if (res.data.stat == 'Ok') {
                        setentered(true)
                        setEnteredLong(false)
                        setEnteredShort(true)
                        let tradeCheckId = setInterval(tradeCheck, 500);
                        setTradeCheckInterval(tradeCheckId);
                        console.log('New order placed at - ' + price);
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
            axios.post('/placescalporderce', { 'ce': index + expiry + 'C' + scalpStrikePrice, 'qty': qty })
                .then((res) => {
                    console.log(res);
                    if (res.data.stat == 'Ok') {
                        setentered(true)
                        setEnteredLong(true)
                        setEnteredShort(false)
                        let tradeCheckId = setInterval(tradeCheck, 500);
                        setTradeCheckInterval(tradeCheckId);
                        console.log('New order placed at - ' + price);
                    }
                    else {
                        alert('Order placing error❗❌')
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    function closePositions() {
        axios.get('/exitallorders')
            .then((res) => { console.log(res); })
            .catch((err) => { console.log(err); })
    }

    function scalpPython() {
        axios.post('/scalping', { 'entryPrice': scalpEntryPrice, 'entryStrike': scalpStrikePrice })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div>
            <div>Scalping</div>
            <div>
                <select name="Select Index"
                    onChange={(e) => {
                        setIndex(e.target.value);
                        if (e.target.value == 'NIFTY') {setExpiry(expiryData[0].date);setQty(expiryData[0].qty);setPriceFeedLink('/pricefeednifty');}
                        else if (e.target.value == 'BANKNIFTY') {setExpiry(expiryData[1].date);setQty(expiryData[1].qty);setPriceFeedLink('/pricefeedbanknifty')}
                        else if (e.target.value == 'FINNIFTY') {setExpiry(expiryData[2].date);setQty(expiryData[2].qty);setPriceFeedLink('/pricefeedfinnifty')}
                        else if (e.target.value == 'MIDCPNIFTY') {setExpiry(expiryData[3].date);setQty(expiryData[3].qty);setPriceFeedLink('/pricefeedmidcap')}
                        else {setExpiry(expiryData[4].date);setQty(expiryData[4].qty);setPriceFeedLink('/pricefeedsensex')}
                    }}>
                    <option name="Select Index" selected disabled hidden >Index</option>
                    <option value="NIFTY">Nifty 50</option>
                    <option value="BANKNIFTY">Bank Nifty</option>
                    <option value="FINNIFTY">Fin Nifty</option>
                    <option value="MIDCPNIFTY">Midcap Nifty</option>
                    <option value="SENSEX">Sensex</option>
                </select>
                <div>
                <input type="text" name="" id="" placeholder='Enter expiry date' />
                <button>Feed New Date</button>
                </div>
            </div>
            <div>
                <button onClick={startFeed}>Start Price Feed</button>
                <button onClick={stopFeed}>Stop Price Feed</button>
            </div>
            <div>{index} : {price}</div>
            <div>
                <div>
                    <input type="text" placeholder='Entry price' onChange={(e) => { setScalpEntryPrice(e.target.value); setScalpStrikePrice(Math.round(e.target.value / 50) * 50) }} />
                </div>
                <button onClick={startScalp}>Start Scalping</button>
                {/* <button onClick={stopScalp}>Stop Waiting</button> */}
                <button onClick={stopScalpCheck}>Stop Scalping</button>
                <button onClick={stopTradeCheck}>Stop Trades</button>
                <button onClick={closePositions}>Close Positions</button>
                <button onClick={killSwitch}>Kill Everything</button>
                {/* <button onClick={scalpPython}>Scalp Python</button> */}
            </div>
        </div>
    )
}

export default Scalping