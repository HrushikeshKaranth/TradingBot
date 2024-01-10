from app import app, api
from flask import request, jsonify
from api_helper import ShoonyaApiPy
import logging
import pyotp
import yaml


def login():
    # enable dbug to see request and responses
    logging.basicConfig(level=logging.DEBUG)

    # credentials
    user    = 'FA196478'
    pwd     = 'Hrushi@476'
    factor2 = 'TPY6T3M3F536E7C4757IL466424J53E5'
    vc      = 'FA196478_U'
    app_key = '0d2eb21c0ff1ab424f4233a3cb82aab5'
    imei    = 'abc1234'
    
    # with open('cred.yml') as f:
    #     cred = yaml.load(f, Loader=yaml.FullLoader)
    #     print(cred)

    # make the api call
    otp = pyotp.TOTP(factor2).now()
    ret = api.login(userid = user, password = pwd, twoFA=otp, vendor_code=vc, api_secret=app_key, imei=imei)

    print(ret)
    return jsonify(ret)

def logout():
    ret = api.logout()
    print(ret)
    return jsonify(ret)
