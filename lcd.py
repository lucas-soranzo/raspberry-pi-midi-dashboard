import socket
import subprocess
import asyncio

from i2clcd import i2clcd
from datetime import datetime

from log import log

lcd = i2clcd(i2c_bus=1, i2c_addr=0x27, lcd_width=16)
lcd.init()

lcd.print_line("Initializing...", line=0)

try:
    ip = socket.gethostbyname(socket.gethostname())
    lcd.print_line(ip or "IP not found", line=0, align="CENTER")
except Exception as e:
    lcd.print_line(ip or "Error getting Ip", line=0, align="CENTER")
    lcd.print_line(e, line=1)
    log.exception(e)

async def loop():
    while 1:
        supervisor_status = subprocess.getoutput('supervisorctl status')
        supervisor_split = list(filter(lambda s: s, supervisor_status.split(' ')))

        if len(supervisor_split) > 1:
            line_text = supervisor_split[1] 
            line_text += (' ' * (16 - (len(line_text) + 5)) ) + datetime.now().strftime('%H:%M')
            lcd.print_line(line_text, line=1)

        await asyncio.sleep(5)

asyncio.get_event_loop().run_until_complete(loop())
    
