from api_helper import ShoonyaApiPy
import logging,pyotp
from api_helper import ShoonyaApiPy
import pandas as pd

api = ShoonyaApiPy()
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

ret = api.searchscrip('BSE','sensex')
print(pd.DataFrame(ret))
