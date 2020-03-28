import serial

from log import log

ser = None
try:
    ser = serial.Serial(
        port='/dev/ttyS0',
        baudrate=31250,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        bytesize=serial.EIGHTBITS,
        timeout=1
    )    
except Exception as e:
    log.error(e)
