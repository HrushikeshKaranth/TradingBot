from api_helper import ShoonyaApiPy
import logging

# enable dbug to see request and responses
logging.basicConfig(level=logging.DEBUG)

# start of our program
api = ShoonyaApiPy()

# credentials
user = 'FA196478'
pwd = 'Hrushi@476'
factor2 = 'TPY6T3M3F536E7C4757IL466424J53E5'
vc = 'FA196478_U'
app_key = '0d2eb21c0ff1ab424f4233a3cb82aab5'
imei = 'abc1234'

# make the api call
ret = api.login(userid=user, password=pwd, twoFA=factor2, vendor_code=vc, api_secret=app_key, imei=imei)

print(ret)
