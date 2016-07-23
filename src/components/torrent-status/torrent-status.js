import ko from 'knockout';
import templateMarkup from 'text!./torrent-status.html';

class TorrentStatus {
    constructor(params) {
        this.message = ko.observable('Hello from the torrent-status component!');
    }
    
    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: TorrentStatus, template: templateMarkup };
