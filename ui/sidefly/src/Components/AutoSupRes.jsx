import React, { useEffect, useState } from 'react'
import axios from '../Helpers/Axios'
import expiryDates from '../Utils/expiryDates.json'

function AutoSupRes() {

    let [expiryData, setExpryData] = useState(expiryDates.data)
    let [expiry, setExpiry] = useState('')
    let [index, setIndex] = useState('')
    let [StraddleSpread, setStraddleSpread] = useState(expiryDates.data[0].straddleSpread)
    let [feed, setFeed] = useState(null)
    let [price, setPrice] = useState(0)
    let [entryStrike, setEntryStrike] = useState('')
    let [currentStrike, setCurrentStrike] = useState(0)
    let [strikeDistance, setStrikeDistance] = useState(0)
    let [priceFeedLink, setPriceFeedLink] = useState('')
    let [qty, setQty] = useState(0)
    let [check, setCheck] = useState(0)
    let [checkIntId, setCheckIntId] = useState(null)
    let [orderCount, setOrderCount] = useState(0)
    let [sup, setSup] = useState(0)
    let [res, setRes] = useState(0)
    let [resStrike, setResStrike] = useState(0)
    let [supStrike, setSupStrike] = useState(0)
    let [checkMsgSup, setCheckMsgSup] = useState('')
    let [checkMsgRes, setCheckMsgRes] = useState('')
    let [isSupPlaced, setIsSupPlaced] = useState(false)
    let [isResPlaced, setIsResPlaced] = useState(false)
    let [checkSup, setCheckSup] = useState(false)
    let [checkRes, setCheckRes] = useState(false)

    // console.log(sup);
    // console.log(supStrike);
    // console.log(res);
    // console.log(resStrike);
    // useEffect(() => {
    //     if (isOrderPlaced == true && entryStrike != currentStrike) {
    //         if (entryPrice - price < - StraddleSpread || entryPrice - price > StraddleSpread) {
    //             console.log('inside');
    //             setIsOrderPlaced(false)
    //             exitOrder();
    //         }
    //         else { console.log('Monitoring Straddle! In '+'[Order count - '+orderCount); }
    //     }
    //     else if (isOrderPlaced == false) {
    //         entryStrike != currentStrike ? exitOrder() : console.log('Monitoring Straddle! Out '+'[Order count - '+orderCount);
    //     }
    //     else {
    //         console.log('Straddle`s Good! ' + '[Order Count - ' + orderCount + ']');
    //     }
    // }, [check])

    // useEffect(() => {
    //     if (isOrderPlaced == true && entryStrike - price < - StraddleSpread) {
    //         placeDownStrike();
    //     }
    //     else if (isOrderPlaced == true && entryStrike - price > StraddleSpread) {
    //             placeUpStrike();
    //     }
    //     else {
    //         console.log('All Good! ' + '[Order Count - ' + orderCount + ']');
    //     }
    // }, [check])

    // console.log(entryStrike);
    // console.log(upStrike);
    // console.log(downStrike);

    // function reloadCheck(){
    //     if(price < entryStrike){
    //         setIsOrderPlaced(true)
    //         setIsDownStrikePlaced(true)
    //         setIsUpStrikePlaced(false)
    //         console.log('Down strike was placed - '+entryStrike+' PE');
    //     }
    //     else if(price > entryStrike){
    //         setIsOrderPlaced(true)
    //         setIsUpStrikePlaced(true)
    //         setIsDownStrikePlaced(false)
    //         console.log('Up strike was placed - '+entryStrike+' CE');
    //     }
    //     else {console.log('Cannot determine direction!');}
    // }

    // useEffect(() => {
    //     if (isDownStrikePlaced == false && price < entryStrike) {
    //         if (entryStrike - price > StraddleSpread) {
    //             console.log('Going Short...');
    //             placeDownStrike();
    //         }
    //         else{
    //             console.log('Monitoring PUT Side...');
    //         }
    //     }
    //     else if (isUpStrikePlaced == false && price > entryStrike) {
    //         if (entryStrike - price < - StraddleSpread) {
    //             console.log('Going Long...');
    //             placeUpStrike();
    //         }
    //         else{
    //             console.log('Monitoring CALL Side...');
    //         }
    //     }
    //     else{console.log('Monitoring...! [Order count - '+orderCount+']');}
    // }, [check])

    // Trade Conditions checking use effects
    useEffect(() => {
        if (checkSup == true && isSupPlaced == true && price < sup) {
            stopCheck();
            exitOrderSup();
        }
        else if (checkSup == true && isSupPlaced == false && price > sup) {
            stopCheck();
            enterOrderSup();
        }
    }, [check])

    useEffect(() => {
        if (checkRes == true && isResPlaced == true && price > res) {
            stopCheck();
            exitOrderRes();
        }
        else if (checkRes == true && isResPlaced == false && price < res) {
            stopCheck();
            enterOrderRes()
        }
        else{
            console.log('Checking!');
        }
    }, [check])
    // -----

    // Ordering Functions
    function enterOrderSup() {
        axios.post('/placeorderud', { 'opt': index + expiry + 'P' + supStrike, 'qty': qty })
            .then((res) => {
                if (res.data.stat == 'Ok') {
                    console.log('Support entered!');
                    setIsSupPlaced(true);
                    startCheck();
                    setOrderCount(orderCount = orderCount + 1)
                }
                else {
                    alert('Order placing error❗❌')
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    function exitOrderSup() {
        axios.post('/enterorderlong', { 'ce': index + expiry + 'P' + supStrike, 'qty': qty })
            .then((res) => {
                if (res.data.stat == 'Ok') {
                    console.log('Support exited!');
                    setIsSupPlaced(false);
                    startCheck();
                    setOrderCount(orderCount = orderCount + 1)
                }
                else {
                    alert('Order placing error❗❌')
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    function enterOrderRes() {
        axios.post('/placeorderud', { 'opt': index + expiry + 'C' + resStrike, 'qty': qty })
            .then((res) => {
                if (res.data.stat == 'Ok') {
                    console.log('Resistance entered!');
                    setIsResPlaced(true);
                    startCheck();
                    setOrderCount(orderCount = orderCount + 1)
                }
                else {
                    alert('Order placing error❗❌')
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    function exitOrderRes() {
        axios.post('/enterorderlong', { 'ce': index + expiry + 'C' + resStrike, 'qty': qty })
            .then((res) => {
                if (res.data.stat == 'Ok') {
                    console.log('Resistance exited!');
                    setIsResPlaced(false);
                    startCheck();
                    setOrderCount(orderCount = orderCount + 1)
                }
                else {
                    alert('Order placing error❗❌')
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function placeOrder() {
        axios.post('/placeorder', { 'ce': index + expiry + 'C' + resStrike, 'pe': index + expiry + 'P' + supStrike, 'qty': qty })
            .then((res) => {
                if (res.data[0].stat == 'Ok' && res.data[1].stat == 'Ok') {
                    console.log('Trades entered!');
                    setCheckSup(true);
                    setCheckRes(true);
                    setIsResPlaced(true);
                    setIsSupPlaced(true);
                    startCheck();
                    setOrderCount(orderCount = orderCount + 2);
                }
                else {
                    alert('Order placing error❗❌')
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function exitOrder() {
        stopCheck();
        axios.post('/exitallorders')
            .then((res) => {
                // console.log(res);
                console.log('All orders exited!');
                setCheckRes(false);
                setCheckSup(false);
                return true;
            })
            .catch((err) => {
                console.log('Errors exiting all orders!');
                console.log(err);
                return false;
            })
    }

    function holdStrat() {
        setCheckRes(false);
        setCheckSup(false);
    }
    function ResumeStrat() {
        setCheckRes(true);
        setCheckSup(true);
    }
    function resetStrat() {
        stopCheck();
        setCheckSup(true);
        setCheckRes(true);
        setIsResPlaced(true);
        setIsSupPlaced(true);
        setRes(localStorage.getItem("res"))
        setResStrike(localStorage.getItem("resStrike"))
        setSup(localStorage.getItem("sup"))
        setSupStrike(localStorage.getItem("supStrike"))
        // setIndex(localStorage.getItem("index"))
        // setExpiry(localStorage.getItem("expiry"))
        // setPriceFeedLink(localStorage.getItem("feedLink"));
        // startFeed();
        // startCheck();
    }
    // ----

    // Checking Functions
    function stratCheck() {
        setCheck(check = check + 1)
    }

    function startCheck() {
        let checkIntervalId = setInterval(stratCheck, 300)
        setCheckIntId(checkIntervalId);
    }

    function stopCheck() {
        clearInterval(checkIntId);
        // setCheckRes(false);
        // setCheckSup(false);
    }

    function startFeed() {
        let feedIntervalId = setInterval(getPrice, 300)
        setFeed(feedIntervalId);
        console.log('Price Feed started ✔');
    }

    function stopFeed() {
        clearInterval(feed)
        console.log('Price Feed Stopped ❌');
    }
    function getPrice() {
        axios.get(priceFeedLink)
            .then((res) => {
                // console.log(res.data['lp'])
                setPrice(res.data['lp'])
            })
            .catch((err) => {
                console.log(err);
            })
    }
    // -----

    // Use effects 
    // useEffect(() => {
    //     setCurrentStrike(Math.round(price / strikeDistance) * strikeDistance)
    // }, [price, entryStrike])

    useEffect(() => {
        checkSup == true ? setCheckMsgSup('Checking') : setCheckMsgSup('Stopped')
        checkRes == true ? setCheckMsgRes('Checking') : setCheckMsgRes('Stopped')
        localStorage.setItem("orderCount", orderCount);
    }, [checkSup, checkRes, check, orderCount])
    // -----




    // function placeOrder() {
    //     setEntryStrike(currentStrike)
    //     localStorage.setItem("entryStrike", currentStrike)
    //     setEntryPrice(price)
    //     axios.post('/placeorder', { 'ce': index + expiry + 'C' + upStrike, 'pe': index + expiry + 'P' + downStrike, 'qty': qty })
    //         .then((res) => {
    //             if (res.data[0].stat && res.data[1].stat == 'Ok') {
    //                 console.log('New order placed at - ' + currentStrike);
    //                 setIsOrderPlaced(true);
    //                 setOrderCount(orderCount=orderCount + 2)
    //             }
    //             else {
    //                 alert('Order placing error❗❌')
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }

    // function placeUpStrike() {
    //     stopCheck();
    //     axios.post('/closeshortgolong', { 'sell': index + expiry + 'P' + entryStrike, 'buy': index + expiry + 'C' + entryStrike, 'qty': qty })
    //         .then((res) => {
    //             if (res.data[0].stat && res.data[1].stat == 'Ok') {
    //                 startCheck();
    //                 setIsDownStrikePlaced(false)
    //                 setIsUpStrikePlaced(true)
    //                 console.log('Sold - ' + entryStrike + ' PE');
    //                 console.log('Bought - ' + entryStrike +' CE');
    //                 setOrderCount(orderCount= orderCount+1)
    //             }
    //             else {
    //                 alert('Order placing error❗❌')
    //             }
    //         })
    //         .catch((err) => { console.log(err); })
    //     }

    //     function placeDownStrike() {
    //         stopCheck()
    //         axios.post('/closeshortgolong', { 'sell': index + expiry + 'C' + entryStrike, 'buy': index + expiry + 'P' + entryStrike, 'qty': qty })
    //         .then((res) => {
    //             if (res.data[0].stat && res.data[1].stat == 'Ok') {
    //                 startCheck();
    //                 setIsDownStrikePlaced(true)
    //                 setIsUpStrikePlaced(false)
    //                 console.log('Sold - ' + entryStrike + ' CE');
    //                 console.log('Bought - ' + entryStrike +' PE');
    //                 setOrderCount(orderCount= orderCount+1)
    //             }
    //             else {
    //                 alert('Order placing error❗❌')
    //             }
    //         })
    //         .catch((err) => { console.log(err); })

    // }



    // function enterOrder() {
    //     stopCheck();
    //     if (price < entryStrike) {
    //         axios.post('/enterordershort', { 'pe': index + expiry + 'P' + entryStrike, 'qty': qty })
    //             .then((res) => {
    //                 if (res.data.stat == 'Ok') {
    //                     console.log('PUT entered at ' + entryStrike);
    //                     setIsOrderPlaced(true)
    //                     setIsDownStrikePlaced(true)
    //                     startCheck();
    //                     setOrderCount(orderCount=orderCount + 1)
    //                 }
    //                 else {
    //                     alert('order exiting error❗❌');
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             })
    //         }
    //         else if (price > entryStrike) {
    //             axios.post('/enterorderlong', { 'ce': index + expiry + 'C' + entryStrike, 'qty': qty })
    //             .then((res) => {
    //                 if (res.data.stat == 'Ok') {
    //                     console.log('CALL entered at ' + entryStrike);
    //                     setIsOrderPlaced(true)
    //                     setIsUpStrikePlaced(true)
    //                     startCheck();
    //                     setOrderCount(orderCount=orderCount + 1)
    //                 }
    //                 else {
    //                     alert('order exiting error❗❌');
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             })
    //     }
    //     else { console.log('No entries!'); }

    // }

    return (
        <div className='priceFeedSec'>
            <>Ultima</>
            <div className="sub_">
                <div className="priceFeedSettings">
                    <button onClick={startFeed}>Start Feed</button>
                    <button onClick={stopFeed}>Stop Feed</button>
                    <select name="Select Index"
                        onChange={(e) => {
                            setIndex(e.target.value);
                            localStorage.setItem("index",e.target.value);
                            if (e.target.value == 'NIFTY') { setExpiry(expiryData[0].date); localStorage.setItem("expiry",expiryData[0].date); setQty(expiryData[0].qty); setPriceFeedLink('/pricefeednifty');localStorage.setItem("feedLink","/pricefeednifty"); setStrikeDistance(expiryData[0].strikeDistance); setStraddleSpread(expiryData[0].straddleSpread) }
                            else if (e.target.value == 'BANKNIFTY') { setExpiry(expiryData[1].date); localStorage.setItem("expiry",expiryData[1].date); setQty(expiryData[1].qty); setPriceFeedLink('/pricefeedbanknifty'); localStorage.setItem("feedLink","/pricefeedbanknifty"); setStrikeDistance(expiryData[1].strikeDistance); setStraddleSpread(expiryData[1].straddleSpread) }
                            else if (e.target.value == 'FINNIFTY') { setExpiry(expiryData[2].date); localStorage.setItem("expiry",expiryData[2].date); setQty(expiryData[2].qty); setPriceFeedLink('/pricefeedfinnifty'); localStorage.setItem("feedLink","/pricefeedfinnifty"); setStrikeDistance(expiryData[2].strikeDistance); setStraddleSpread(expiryData[2].straddleSpread) }
                            else if (e.target.value == 'MIDCPNIFTY') { setExpiry(expiryData[3].date); localStorage.setItem("expiry",expiryData[3].date); setQty(expiryData[3].qty); setPriceFeedLink('/pricefeedmidcap'); localStorage.setItem("feedLink","/pricefeedmidcap"); setStrikeDistance(expiryData[3].strikeDistance); setStraddleSpread(expiryData[3].straddleSpread) }
                            else { setExpiry(expiryData[4].date); localStorage.setItem("expiry",expiryData[4].date); setQty(expiryData[4].qty); setPriceFeedLink('/pricefeedsensex'); localStorage.setItem("feedLink","/pricefeedsensex"); setStrikeDistance(expiryData[4].strikeDistance); setStraddleSpread(expiryData[4].straddleSpread) }
                        }}>
                        <option name="Select Index" selected disabled hidden >Index</option>
                        <option value="NIFTY">Nifty 50</option>
                        <option value="BANKNIFTY">Bank Nifty</option>
                        <option value="FINNIFTY">Fin Nifty</option>
                        <option value="MIDCPNIFTY">Midcap Nifty</option>
                        {/* <option value="SENSEX">Sensex</option> */}
                    </select>
                    <span>Expiry: {expiry}</span>
                    <span>Order count: {orderCount}</span>
                </div>
            </div>
            <div className='sub_'>
                <div className="sub">
                    <span>{index}: {price}</span>
                    {/* <span>Current Strike: {currentStrike}</span> */}
                    <span>
                        Res: <input type="text" value={res} onChange={(e) => { setRes(e.target.value);localStorage.setItem("res", e.target.value); }} /> &emsp;
                        Res-Strike: <input type="text" value={resStrike} onChange={(e) => { setResStrike(e.target.value);localStorage.setItem("resStrike", e.target.value); }} /> &emsp;
                        <button onClick={() => { setCheckRes(true) }}>Check</button> &emsp;
                        <button onClick={() => { setCheckRes(false) }}>Stop</button> &emsp;
                        <span>[{checkMsgRes}]</span>
                    </span>
                    <span>
                        Sup: <input type="text" value={sup} onChange={(e) => { setSup(e.target.value);localStorage.setItem("sup", e.target.value); }} /> &emsp;
                        Sup-Strike: <input type="text" value={supStrike} onChange={(e) => { setSupStrike(e.target.value);localStorage.setItem("supStrike", e.target.value); }} /> &emsp;
                        <button onClick={() => { setCheckSup(true) }}>Check</button> &emsp;
                        <button onClick={() => { setCheckSup(false) }}>Stop</button> &emsp;
                        <span>[{checkMsgSup}]</span>
                    </span>
                </div>
            </div>
            <div className="sub_">
                <button onClick={startCheck}>Start</button>
                <button onClick={stopCheck}>Stop</button>
                <button onClick={holdStrat}>Hold</button>
                <button onClick={ResumeStrat}>Resume</button>
                <button onClick={placeOrder}>Place</button>
                <button onClick={exitOrder}>Exit</button>
                <button onClick={resetStrat}>Reset</button>
            </div>
        </div>)
}

export default AutoSupRes