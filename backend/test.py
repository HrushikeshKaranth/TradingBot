# from app import app, api
# from flask import request, jsonify
from api_helper import ShoonyaApiPy
# import logging
# import pyotp
# import yaml
from NorenApi import NorenApi
import config

shoonya=NorenApi()
ret = shoonya.login(config.user, config.pwd, config.factor2, config.vc, config.app_key, config.imei)
print(ret)