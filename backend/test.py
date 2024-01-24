# option strike getter

def getSymbol(txt):
    res = api.serachscrip('NFO',txt)
    resDf = pd.Dataframe(res['values'])
    return res.sort_values(by='weekely').iloc[0]

month = 'FEB'
atmstrike = '21300'
cesymbolinfo = getSymbol(f'NIFTY {month} {atmstrike} CE')
ce = cesymbolinfo['tsym']

cesymbolinfo = getSymbol(f'BANKNIFTY {month} {atmstrike} CE')