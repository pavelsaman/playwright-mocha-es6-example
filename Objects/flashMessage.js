

class FlashMessage {
    constructor () {
        this.msg = '.c-flash-message.c-flash-message--';
        this.info = this.msg + 'info';
        this.warning = this.msg + 'warning';
        this.confirmation = this.msg + 'confirmation';
    }
}

export default new FlashMessage();