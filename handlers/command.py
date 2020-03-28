from tornado.web import RequestHandler
from log import log

from serial_ import ser

class CommandHandler(RequestHandler):
    def prepare(self):
        self.set_header('Content-Type', 'application/json')

    def get(self):
        param_bytes = [
            self.get_argument('status_byte'),
            self.get_argument('data_byte1', '00'),
            self.get_argument('data_byte2', '00'),
        ]

        status_byte = int(param_bytes[0], 16)
        data_byte1 = int(param_bytes[1], 16)
        data_byte2 = int(param_bytes[2], 16)

        log.info('Midi CMD: 0x{:x} 0x{:x} 0x{:x}'.format(status_byte, data_byte1, data_byte2))

        if ser is not None:
            try:
                ser.write([
                    status_byte,
                    data_byte1,
                    data_byte2,
                ])
            except Exception as e:
                log.exception(e)
        else:
            log.warning('No serial por avaiable to write.')

        self.write({
            'status_byte': f'0x{status_byte:02x}',
            'data_byte1': f'0x{data_byte1:02x}',
            'data_byte2': f'0x{data_byte2:02x}',
        })