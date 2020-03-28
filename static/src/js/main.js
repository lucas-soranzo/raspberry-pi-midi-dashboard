(function( $ ) {
    $.fn.midiCommand = function(options) {
        console.log(this)
        let defaults = {
            'byte1': 0xCC,
            'byte2': 0x00,
            'byte3': 0x00,
            'name': 'New Command'
        }

        Object.assign(defaults, options)
        
        this.addClass('btn btn-light btn-lg mr-3')
        this.html(defaults.name)
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

    const parsed = ['name', 'byte1', 'byte2', 'byte3'].reduce((reduced, key) => {
        reduced[key] = data.get(key)
        return reduced;
    }, {})
    Commands.push(parsed)
})