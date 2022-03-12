from get_ocbc_fx_rate import get_ocbc_fx_rate
from get_sc_fx_rate import get_sc_fx_rate
import pandas as pd

def get_banks_fx_rates(currency_from, currency_to):
    bank_functions = [get_ocbc_fx_rate, get_sc_fx_rate]
    df = pd.DataFrame(columns=['Bank', 'Currency From', 'Currency To', 'Buying Rate', 'Selling Rate'])
    for function in bank_functions:
        bank_data = function(currency_from, currency_to)
        if not bank_data.empty:
            df = pd.concat([df, bank_data], ignore_index = True)
    return df

print(get_banks_fx_rates('MYR','USD'))