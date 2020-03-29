(function( $ ) {
    const sendCommand = (status_byte, data_byte1, data_byte2) =>
        $.ajax({
            url:'/command',
            data: { status_byte, data_byte1, data_byte2 },
            success: data => getToast({text: Object.values(data).join(' ')})
        });

    $.fn.midiCommand = function(options) {
        let defaults = {
            'byte1': 0xCC,
            'byte2': 0x00,
            'byte3': 0x00,
            'name': 'New Command',
            'icon': null,
            'color': 'light',
            'size': 'lg',
            'style': 'outline',
            'type': 'button'
        }

        Object.assign(defaults, options)

        defaults.icon = defaults.icon.toLocaleLowerCase()
        defaults.style = defaults.style.toLocaleLowerCase()
        defaults.color = defaults.color.toLocaleLowerCase()
        defaults.type = defaults.type.toLocaleLowerCase()

        let content = ''
        let classes = []

        if (defaults.type === 'button') {            
            if (defaults.icon) { content = `<i class="fas fa-${defaults.icon}"></i>${content}`}
            else { content = defaults.name}
            
            classes = [
                ...classes,
                'btn',
                `btn${defaults.style && defaults.style != 'Solid' ? '-' + defaults.style : ''}-${defaults.color}`,
                `btn${defaults.size ? '-' + defaults.size : ''}`,
                'mr-3',
            ]

            this.on('click', e => sendCommand(defaults.byte1, defaults.byte2, defaults.byte3))
        } else if(defaults.type === 'slider') {
            this.on('change', e => sendCommand(defaults.byte1, defaults.byte2, Number(parseInt((e.target.value / 100) * 127)).toString(16)))   
            this.on('dblclick', e => {
                e.preventDefault()
                e.target.value = 71.653543307
                sendCommand(defaults.byte1, defaults.byte2, '5b')
            })         
        }
        
        this.addClass([
            ...classes,
        ].join(' '))

        this.html(content)

        return this
    }
}(jQuery));

const Commands = new class {
    constructor() {
        this.stored = []
        this.load()
    }

    createElement(cmd) {
        let ele = null;
        console.log(cmd.type)
        if (cmd.type.toLocaleLowerCase() === 'button') {
            ele = $('<button>').midiCommand(cmd)
        } else if(cmd.type.toLocaleLowerCase() === 'slider') {
            ele = $('<input>', { type: "range", name: "slider", orient: "vertical", }).midiCommand(cmd)
        }

        ele.appendTo('#commandContainer')
    }

    push(cmd) {
        this.stored.push(cmd)
        this.createElement(cmd)
        window.localStorage.setItem('commands', JSON.stringify(this.stored))
    }

    load() {
        const storedCommands = window.localStorage.getItem('commands')
        if (storedCommands) { 
            try {
                this.stored = JSON.parse(storedCommands)
                this.stored.map(cmd => this.createElement(cmd))
            } catch (error) {
                console.error(error)
            }
         }        
    }

    clear() {
        window.localStorage.removeItem('commands')
        window.location.reload()
    }
}()

$('#clearCommands').on('click', () => Commands.clear())

$('#commandForm').on('submit', e => {
    e.preventDefault()

    const data = new FormData(e.target)

    const parsed = ['name', 'icon', 'color', 'size', 'style', 'type', 'byte1', 'byte2', 'byte3'].reduce((reduced, key) => {
        reduced[key] = data.get(key)
        return reduced;
    }, {})
    Commands.push(parsed)

    $('#commandFormModal').modal('hide')
})

var curZoom = 100;

const updateZoom = step => {
    var zoomStep = 20;
    
    curZoom += step * zoomStep;

    window.localStorage.setItem('zoom', curZoom)
    $('body').css('zoom', ` ${curZoom}%`);
}

const storageZoom = window.localStorage.getItem('zoom')
if (storageZoom) { 
    try {
        curZoom = parseInt(storageZoom)
    } catch (error) {
        window.localStorage.removeItem('zoom')
    }
 }
$('body').css('zoom', ` ${curZoom}%`);

$('#zoomIn').on('click', () => updateZoom(1));
$('#zoomOut').on('click', () => updateZoom(-1));
  
$('#requestFullScreen').on('click', () => {
    var doc = window.document;
    var docEl = doc.documentElement;
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
})

function getToast(config) {
    const defaults = {
        'title': 'Pi Midi Dashboard',
        'text': '',
    }
    Object.assign(defaults, config)
    const toast = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2000">
            <div class="toast-header">
                <img src="/static/favicon.png" class="rounded mr-2" alt="...">
                <strong class="mr-auto">${defaults.title}</strong>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                ${defaults.text}
            </div>
        </div>`
    
    $(toast).appendTo('body').toast('show')
}