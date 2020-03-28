(function( $ ) {
    $.fn.midiCommand = function(options) {
        console.log(this)
        let defaults = {
            'byte1': 0xCC,
            'byte2': 0x00,
            'byte3': 0x00,
            'name': 'New Command',
            'icon': null,
            'color': 'light',
            'size': 'lg',
            'style': 'outline'
        }

        Object.assign(defaults, options)
        
        this.addClass([
            'btn',
            `btn${defaults.style && defaults.style != 'Solid' ? '-' + defaults.style.toLocaleLowerCase() : ''}-${defaults.color.toLocaleLowerCase()}`,
            `btn${defaults.size ? '-' + defaults.size.toLocaleLowerCase() : ''}`,
            'mr-3',
        ].join(' '))

        let content = defaults.name
        if (defaults.icon) { content = `<i class="fas fa-${defaults.icon.toLocaleLowerCase()}"></i>${content}`}

        this.html(content)
        this.appendTo('#commandContainer')
        this.on('click', e => {
            this.trigger('blur')
            $.ajax({
                url:'/command',
                data: {
                    status_byte: defaults.byte1,
                    data_byte1: defaults.byte2,
                    data_byte2: defaults.byte3
                },
                success: console.log
            })
        })

        return this
    }
}(jQuery));

const Commands = new class {
    constructor() {
        this.stored = []
        this.load()
    }

    createElement(cmd) {
        return $('<button>').midiCommand(cmd)
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

    const parsed = ['name', 'icon', 'color', 'size', 'style', 'byte1', 'byte2', 'byte3'].reduce((reduced, key) => {
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