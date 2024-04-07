import React, { useEffect, useState } from 'react'
import axios from '../Helpers/Axios'
import expiryDates from '../Utils/expiryDates.json'

function DoubleFlys() {

    let [expiryData, setExpryData] = useState(expiryDates.data)
    let [expiry, setExpiry] = useState('')
    let [index, setIndex] = useState('')
    let [StraddleSpread, setStraddleSpread] = useState(expiryDates.data[0].straddleSpread)
    const [feed, setFeed] = useState(null)
    const [straddle, setStraddle] = useState(null)
    let [price, setPrice] = useState(0)
    let [position, setPosition] = useState(0)
    let [positionInt, setPositionInt] = useState(0)
    let [upStrike, setUpStrike] = useState(0)
    let [downStrike, SetDownStrike] = useState(0)
    let [entryPrice, setEntryPrice] = useState(0)
    let [entryStrike, setEntryStrike] = useState('')
    let [currentStrike, setCurrentStrike] = useState(0)
    let [strikeDistance, setStrikeDistance] = useState(0)
    let [priceFeedLink, setPriceFeedLink] = useState('/pricefeednifty')
    let [qty, setQty] = useState(0)
    let [check, setCheck] = useState(0)
    let [orderCount, setOrderCount] = useState(3)
    let [isOrderPlaced, setIsOrderPlaced] = useState(false)
    let [isUpStrikePlaced, setIsUpStrikePlaced] = useState(false)
    let [isDownStrikePlaced, setIsDownStrikePlaced] = useState(false)
    let [isStrikePlaced, setIsStrikePlaced] = useState(false)


    function straddleCheck() {
        setCheck(check = check + 1)
    }

    function startStraddle() {
        // count = setInterval(straddleCheck, 1000)
        let straddleIntervalId = setInterval(straddleCheck, 300)
        setStraddle(straddleIntervalId);
        // console.log('Straddle started ✔');
    }
    function stopStraddle() {
        clearInterval(straddle);
        // clearInterval(count);
        // console.log('Straddle stopped ❌');
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

    function startPosition() {
        let positionIntervalId = setInterval(getPosition, 300)
        setPositionInt(positionIntervalId);
        console.log('P&L Feed started ✔');
    }
    function stopPosition() {
        clearInterval(positionInt)
        console.log('P&L Feed Stopped ❌');
    }

    useEffect(() => {
        setCurrentStrike(Math.round(price / strikeDistance) * strikeDistance)
        // setUpStrike(Math.round(price / strikeDistance) * strikeDistance +50)
        // SetDownStrike(Math.round(price / strikeDistance) * strikeDistance -50)
        setUpStrike(Number(currentStrike)+strikeDistance)
        SetDownStrike(currentStrike-strikeDistance)
    }, [price,entryStrike])

    function getPrice() {
        axios.get(priceFeedLink)
            .then((res) => {
                // console.log(res.data['lp'])
                setPrice(res.data['lp'])
                // setCurrentStrike(Math.round(res.data['lp'] / strikeDistance) * strikeDistance)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function getPosition(){
        axios.get('/getpositions')
        .then((res)=>{
            // console.log(res);
            setPosition(res.data);
        })
        .catch((err)=>{console.error(err)})
    }

    useEffect(()=>{
        if(price - entryStrike >strikeDistance || price - entryStrike <-strikeDistance){
            if(isOrderPlaced === true){
                exitOrder();
                placeOrder();
            }
            else{
                console.log('Monitoring Positions...');
            }
        }
    },[check])

    useEffect(()=>{
        if(position <= -999){
            if(isOrderPlaced === true){
                exitOrder();
                prompt('StopLoss hit! 😩');
            }
        }
    },[check])

    function placeOrder() {
        setEntryStrike(currentStrike)
        localStorage.setItem("entryStrike", currentStrike)

        axios.post('/df_placeorder_buy', { 'ce': index + expiry + 'C' + currentStrike, 'pe': index + expiry + 'P' + currentStrike, 'qty': qty })
            .then((res)=>{
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    console.log('New order placed at - ' + currentStrike + ' 🤗');
                    setIsOrderPlaced(true);
                }
                else {
                    alert('Order placing error❗❌😥');
                }
            })

        axios.post('/df_placeorder_sell', { 'ce': index + expiry + 'C' + upStrike, 'pe': index + expiry + 'P' + downStrike, 'qty': qty*2 })
            .then((res) => {
                if (res.data[0].stat && res.data[1].stat == 'Ok') {
                    console.log('New order placed at - ' + currentStrike + ' 🤗');
                    setIsOrderPlaced(true);
                    startStraddle();
                }
                else {
                    alert('Order placing error❗❌😥');
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }


    function exitOrder() {
        stopStraddle();
        setIsOrderPlaced(false);
        axios.get('/exitallorders')
        .then((res) => {
            localStorage.removeItem('entryStrike');
            console.log(res);
            console.log('All order exited!');
            setIsOrderPlaced(false);
        })
        .catch((err) => {
            console.log(err);
            setIsOrderPlaced(true);
            })
    }

    return (
        <div className='priceFeedSec'>
            {/* <>Sidefly</> */}
            <div className="sub_">
                <div className="priceFeedSettings">
                    <button onClick={startFeed}>Start Feed</button>
                    <button onClick={stopFeed}>Stop Feed</button>
                    <button onClick={startPosition}>Start Position</button>
                    <button onClick={stopPosition}>Stop Position</button>
                    <select name="Select Index"
                        onChange={(e) => {
                            setIndex(e.target.value);
                            if (e.target.value == 'NIFTY') { setExpiry(expiryData[0].date); setQty(expiryData[0].qty); setPriceFeedLink('/pricefeednifty'); setStrikeDistance(expiryData[0].strikeDistance); setStraddleSpread(expiryData[0].straddleSpread) }
                            else if (e.target.value == 'BANKNIFTY') { setExpiry(expiryData[1].date); setQty(expiryData[1].qty); setPriceFeedLink('/pricefeedbanknifty'); setStrikeDistance(expiryData[1].strikeDistance); setStraddleSpread(expiryData[1].straddleSpread) }
                            else if (e.target.value == 'FINNIFTY') { setExpiry(expiryData[2].date); setQty(expiryData[2].qty); setPriceFeedLink('/pricefeedfinnifty'); setStrikeDistance(expiryData[2].strikeDistance); setStraddleSpread(expiryData[2].straddleSpread) }
                            else if (e.target.value == 'MIDCPNIFTY') { setExpiry(expiryData[3].date); setQty(expiryData[3].qty); setPriceFeedLink('/pricefeedmidcap'); setStrikeDistance(expiryData[3].strikeDistance); setStraddleSpread(expiryData[3].straddleSpread) }
                            else { setExpiry(expiryData[4].date); setQty(expiryData[4].qty); setPriceFeedLink('/pricefeedsensex'); setStrikeDistance(expiryData[4].strikeDistance); setStraddleSpread(expiryData[4].straddleSpread) }
                        }}>
                        <option name="Select Index" selected disabled hidden >Index</option>
                        <option value="NIFTY">Nifty 50</option>
                        <option value="BANKNIFTY">Bank Nifty</option>
                        <option value="FINNIFTY">Fin Nifty</option>
                        <option value="MIDCPNIFTY">Midcap Nifty</option>
                        <option value="SENSEX">Sensex</option>
                    </select>
                </div>
            </div>
            <div className='sub_'>
                <div className="sub">
                    <span>{index}: {price}</span>
                    {/* <span>UP: {upStrike}</span> */}
                    <span>Current Strike: {currentStrike}</span>
                    <span>Entry Strike: {entryStrike}</span>
                    <span>Up Strike: {upStrike}</span>
                    <span>Down Strike: {downStrike}</span>
                    <span>P&L: {position} &nbsp; {position>0?'🤑':'😖'}</span>
                    {/* <span>Down: {downStrike}</span> */}
                </div>
            </div>
            <div className="sub_">
                <button onClick={placeOrder}>Place Orders</button>
                <button onClick={exitOrder}>Exit Orders</button>
                {/* <button onClick={closeOrder}>Close</button> */}
                {/* <button onClick={startStraddle}>Start</button> */}
                {/* <button onClick={stopStraddle}>Stop</button> */}
                {/* <button onClick={reloadCheck}>Check</button> */}

                {/* <button onClick={placeUpStrike}>Up Strike</button> */}
                {/* <button onClick={placeDownStrike}>Down Strike</button> */}
            </div>
        </div>)
}

export default DoubleFlys