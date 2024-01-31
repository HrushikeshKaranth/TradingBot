from app import app, api
from flask import request, jsonify
from api_helper import ShoonyaApiPy
import logging
import pyotp
import pandas as pd
import time

tokenValue = ''
def login():
    # enable dbug to see request and responses
    logging.basicConfig(level=logging.DEBUG)

    # credentials
    user    = 'FA196478'
    pwd     = 'Hrushi@476'
    factor2 = 'TGZZ6WQUA723WS57SI65Z66SC6Q36635'
    vc      = 'FA196478_U'
    apikey  = '0d2eb21c0ff1ab424f4233a3cb82aab5'
    imei    = 'abc1234'


    # with open('cred.yml') as f:
    #     cred = yaml.load(f, Loader=yaml.FullLoader)
    #     print(cred)

    # make the api call
    otp = pyotp.TOTP(factor2).now()
    ret = api.login(userid=user, password=pwd, twoFA=otp, vendor_code=vc, api_secret=apikey, imei=imei)

    # print(ret)
    # ret = api.get_security_info(exchange='NSE', token='26000')

    print('Logged in - '+ret['uname'])
    return jsonify(ret)

def setsession():
    res = request.get_json()
    user    = 'FA196478'
    pwd     = 'Hrushi@476'
    token = res['usertoken']
    ret = api.set_session(userid=user, password=pwd, usertoken=token)
    return jsonify(ret)

def logout():
    ret = api.logout()
    print('Logged out!')
    return jsonify(ret)


def pricefeednifty():
    # ret = api.get_quotes(exchange='NSE', token='26000')
    ret = api.get_quotes(exchange='NSE', token='26000')
    # print(ret['lp'])
    # print ('Sending feed...')
    return jsonify(ret)

def pricefeedbanknifty():
    # ret = api.get_quotes(exchange='NSE', token='26000')
    ret = api.get_quotes(exchange='NSE', token='26009')
    # print(ret['lp'])
    return jsonify(ret)

def pricefeedfinnifty():
    # ret = api.get_quotes(exchange='NSE', token='26000')
    ret = api.get_quotes(exchange='NSE', token='26037')
    # print(ret)
    return jsonify(ret)

def pricefeedmidcap():
    # ret = api.get_quotes(exchange='NSE', token='26000')
    ret = api.get_quotes(exchange='NSE', token='26074')
    # print(ret['lp'])
    return jsonify(ret)

def pricefeedsensex():
    # ret = api.get_quotes(exchange='NSE', token='26000')
    ret = api.get_quotes(exchange='BSE', token='1')
    # print(ret['lp'])
    return jsonify(ret)

def pricestream():
    nifty = api.get_quotes(exchange='NSE', token='26000')
    bankNifty = api.get_quotes(exchange='NSE', token='26009')
    finNifty = api.get_quotes(exchange='NSE', token='26037')
    midcap = api.get_quotes(exchange='NSE', token='26074')
    # print('Sending price feed...')
    return jsonify(nifty['lp'], bankNifty['lp'], finNifty['lp'], midcap['lp'])

def placeorder():
    res = request.get_json()
    # tradingSymbol = res['symbol']
    # ce= res['ce']
    # pe=res['pe']
    # month = 'JAN'
    # atmstrike = '21450'
    # expiry = '25JAN24'
    # ce = f'NIFTY{expiry}C{atmstrike}'
    # pe = f'NIFTY{expiry}P{atmstrike}'
    # cesymbolinfo = getSymbol(f'NIFTY {month} {atmstrike} CE')
    # pesymbolinfo = getSymbol(f'NIFTY {month} {atmstrike} PE')
    # ce = cesymbolinfo['tsym']

    # cesymbolinfo = getSymbol(f'BANKNIFTY {month} {atmstrike} CE')

    # remarks = res['remarks']
    # print(res['ce'])
    # print(res['pe'])
    ord1 = api.place_order(buy_or_sell='S', product_type='M',
                            exchange='NFO', tradingsymbol=res['ce'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order1')
    ord2 = api.place_order(buy_or_sell='S', product_type='M',
                            exchange='NFO', tradingsymbol=res['pe'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order2')
    print(ord1)
    print(ord2)
    return jsonify(ord1,ord2)
    # return jsonify('done')

def exitorder():
    res = request.get_json()
    ord1 = api.place_order(buy_or_sell='B', product_type='M',
                            exchange='NFO', tradingsymbol=res['ce'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order1')
    ord2 = api.place_order(buy_or_sell='B', product_type='M',
                            exchange='NFO', tradingsymbol=res['pe'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order2')
    print(ord1)
    print(ord2)
    return jsonify(ord1,ord2)

def placescalporderce():
    res = request.get_json()
    ord1 = api.place_order(buy_or_sell='B', product_type='M',
                            exchange='NFO', tradingsymbol=res['ce'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='Buy')
    print(ord1)
    print('Bought - '+ res['ce'])
    return jsonify(ord1)


def placescalporderpe():
    res = request.get_json()
    ord1 = api.place_order(buy_or_sell='B', product_type='M',
                            exchange='NFO', tradingsymbol=res['pe'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='Buy')
    print(ord1)
    print('Bought - '+ res['pe'])
    # print(ord2)
    return jsonify(ord1)

def placescalporderlong():
    res = request.get_json()
    ord1 = api.place_order(buy_or_sell='S', product_type='M',
                            exchange='NFO', tradingsymbol=res['pe'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order1')
    ord2 = api.place_order(buy_or_sell='B', product_type='M',
                            exchange='NFO', tradingsymbol=res['ce'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order2')
    print(ord1)
    print(ord2)
    print('Sold - '+res['pe']+' and '+'Bought - '+res['ce'])
    return jsonify(ord1,ord2)

def placescalpordershort():
    res = request.get_json()
    ord1 = api.place_order(buy_or_sell='S', product_type='M',
                            exchange='NFO', tradingsymbol=res['ce'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order1')
    ord2 = api.place_order(buy_or_sell='B', product_type='M',
                            exchange='NFO', tradingsymbol=res['pe'], 
                            quantity=res['qty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='order2')
    print(ord1)
    print(ord2)
    print('Sold - '+res['ce']+' and '+'Bought - '+res['pe'])
    return jsonify(ord1,ord2)

def exitallorders():
    # ret = api.get_order_book()
    # ret = api.get_positions()
    # print(ret[0]['tsym'])
    # for i in range(len(ret)):
    #     ord = api.place_order(buy_or_sell='S', product_type='M',
    #                         exchange='NFO', tradingsymbol=ret[i]['tsym'], 
    #                         quantity=ret[i]['daybuyqty'], discloseqty=0,price_type='MKT', price=0, trigger_price=0,
    #                         retention='DAY', remarks='order2')
    a=api.positions()
    a=pd.DataFrame(a)
    for i in a.itertuples():
        if int(i.netqty)<0: 
            api.place_order(buy_or_sell='B', product_type='M', exchange='NFO', tradingsymbol=i.tysm,  quantity=int(i.netqty), discloseqty=0,price_type='MKT', price=0, trigger_price=None, retention='DAY', remarks='my_order_001')
        if int(i.netqty)>0: 
            api.place_order(buy_or_sell='S', product_type='M', exchange='NFO', tradingsymbol=i.tysm,  quantity=int(i.netqty), discloseqty=0,price_type='MKT', price=0, trigger_price=None,retention='DAY', remarks='my_order_002')
    return jsonify(a)

expiry = '01FEB24'
enteredLong = False
enteredShort = False
entered = False

def scalping():
    global enteredLong 
    global enteredShort 
    global entered 
    res = request.get_json()
    entryPrice = str(res['entryPrice'])
    entryStrike = str(res['entryStrike'])
    # expiry = res['expiry']
    symbolCE = 'NIFTY'+expiry+'C'+entryStrike
    symbolPE = 'NIFTY'+expiry+'P'+entryStrike
    # entered = False
    while True:
        nifty = api.get_quotes(exchange='NSE', token='26000')
        niftyPrice = nifty['lp']
        if niftyPrice < entryPrice :
            if entered == False and enteredShort == False and enteredLong == False:
                # if enteredShort == False:
                ord1 = api.place_order(buy_or_sell='B', product_type='M',
                            exchange='NFO', tradingsymbol=symbolCE, 
                            quantity=50, discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='Buy')
                    # print(ord1)
                print('Bought CE - '+ symbolCE)
                entered = True
                enteredLong = True
            elif enteredLong == False and enteredShort == True:
                ord1 = api.place_order(buy_or_sell='S', product_type='M',
                        exchange='NFO', tradingsymbol=symbolPE, 
                        quantity=50, discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                        retention='DAY', remarks='Buy')
                ord2 = api.place_order(buy_or_sell='B', product_type='M',
                        exchange='NFO', tradingsymbol=symbolCE, 
                        quantity=50, discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                        retention='DAY', remarks='Buy')
                enteredShort = False
                enteredLong = True
                # print(ord1)
                # print(ord2)
                print('Sold PE - '+symbolPE+', '+'Bought CE - '+symbolCE)
            else :
                print('In Trade...')
        elif niftyPrice > entryPrice:
            if entered == False and enteredShort == False and enteredLong == False:
                ord1 = api.place_order(buy_or_sell='B', product_type='M',
                            exchange='NFO', tradingsymbol=symbolPE, 
                            quantity=50, discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                            retention='DAY', remarks='Buy')
                    # print(ord1)
                print('Bought CE - '+ symbolCE)
                entered = True
                enteredShort = True
            elif enteredLong == True and enteredShort == False:
                ord1 = api.place_order(buy_or_sell='S', product_type='M',
                        exchange='NFO', tradingsymbol=symbolCE, 
                        quantity=50, discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                        retention='DAY', remarks='Buy')
                ord2 = api.place_order(buy_or_sell='B', product_type='M',
                        exchange='NFO', tradingsymbol=symbolPE, 
                        quantity=50, discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                        retention='DAY', remarks='Buy')
                enteredLong = False
                enteredShort = True
                # print(ord1)
                # print(ord2)
                print('Sold CE - '+symbolCE+', '+'Bought PE - '+symbolPE)
            else :
                print('In Trade...')
        else:
            print('Waiting for entry...')
        # time.sleep(0.5)
        # print(entered)
        # print(enteredLong)
        # print(enteredShort)
    return jsonify('ok')


def getoptiontoken():
    res = request.get_json()
    token = api.searchscrip('NFO', res['option'])
    global tokenValue
    tokenValue = repr(int(token['values'][0]['token']))
    # data = api.get_quotes(exchange='NFO', token=tokenValue)
    return jsonify(tokenValue)

def getoptionfeed():
    data = api.get_quotes(exchange='NFO', token=tokenValue)
    return jsonify(data)
    # global tokenValue
    # print (tokenValue)
    # print(data)