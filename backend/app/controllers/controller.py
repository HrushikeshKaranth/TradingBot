from app import app, api
from flask import request, jsonify
from api_helper import ShoonyaApiPy
import logging
import pyotp
import pandas as pd


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
    ret = api.login(userid=user, password=pwd, twoFA=otp,
                    vendor_code=vc, api_secret=apikey, imei=imei)

    # print(ret)
    # ret = api.get_security_info(exchange='NSE', token='26000')

    # print(ret)
    return jsonify(ret)


def logout():
    ret = api.logout()
    print(ret)
    return jsonify(ret)


def pricefeednifty():
    # ret = api.get_quotes(exchange='NSE', token='26000')
    ret = api.get_quotes(exchange='NSE', token='26000')
    print(ret['lp'])
    return jsonify(ret)

def pricefeedbanknifty():
    # ret = api.get_quotes(exchange='NSE', token='26000')
    ret = api.get_quotes(exchange='NSE', token='26009')
    print(ret['lp'])
    return jsonify(ret)

def pricefeedfinnifty():
    # ret = api.get_quotes(exchange='NSE', token='26000')
    ret = api.get_quotes(exchange='NSE', token='26037')
    print(ret['lp'])
    return jsonify(ret)

def pricefeedmidcap():
    # ret = api.get_quotes(exchange='NSE', token='26000')
    ret = api.get_quotes(exchange='NSE', token='26074')
    print(ret['lp'])
    return jsonify(ret)

def placeorder():
    def getSymbol(txt):
        res = api.searchscrip('NFO',txt)
        resDf = pd.DataFrame(res['values'])
        # print(res.sort_values(by='weekely').iloc[0])
        return resDf.sort_values(by='weekly').iloc[0]

    res = request.get_json()
    tradingSymbol = res['symbol']
    # month = 'JAN'
    atmstrike = '21450'
    expiry = '25JAN24'
    ce = f'NIFTY{expiry}C{atmstrike}'
    pe = f'NIFTY{expiry}P{atmstrike}'
    # cesymbolinfo = getSymbol(f'NIFTY {month} {atmstrike} CE')
    # pesymbolinfo = getSymbol(f'NIFTY {month} {atmstrike} PE')
    # ce = cesymbolinfo['tsym']

    # cesymbolinfo = getSymbol(f'BANKNIFTY {month} {atmstrike} CE')

    remarks = res['remarks']
    ret = api.place_order(buy_or_sell='S', product_type='M',
                        exchange='NFO', tradingsymbol=ce, 
                        quantity=50, discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                        retention='DAY', remarks=remarks)
    ret = api.place_order(buy_or_sell='S', product_type='M',
                        exchange='NFO', tradingsymbol=pe, 
                        quantity=50, discloseqty=0,price_type='MKT', price=0, trigger_price=0,
                        retention='DAY', remarks=remarks)
    print(res['symbol'])
    return jsonify(ret)