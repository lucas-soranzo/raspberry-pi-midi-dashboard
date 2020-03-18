import serial

ser = serial.Serial(
    port='/dev/ttyS0',
    baudrate=31250,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,
    timeout=1
)