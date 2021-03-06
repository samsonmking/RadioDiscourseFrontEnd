import ko from 'knockout';
import templateMarkup from 'text!./torrent-status.html';
import io from 'socketio';
import * as comm from 'comm';

class TorrentOperation {
	constructor(data) {
		this.name = data.name,
		this.id = data.id,
		this.hash = data.hash,
		this.size = ko.observable(data.size),
		this.dl = ko.observable(data.dl),
		this.ul = ko.observable(data.ul),
        this.sizeMb = ko.computed(() => {
            var mb = this.size() / 1000000
            return parseFloat(mb).toFixed(2) + ' mb';
        });
	}
}

class TorrentStatus {
    constructor(params) {
        this.torrents = ko.observableArray();

        comm.renewToken();

        comm.getJSONAuth('/torrents')
            .done((data) => {
                var koTorrents = $.map(data, (torrent) => {
                    return new TorrentOperation(torrent);
                });
                this.torrents(koTorrents);
            })
            .fail((error) => {
                console.log(error);
            })

        var socket = io.connect(comm.socketUrl, {'forceNew': true});
        socket.on('torrentUpdate', (data) => {
        	var torrents = this.torrents();
        	var updated = false;
        	for (var i = 0; i < torrents.length; i++) {
        		var torrent = torrents[i];
        		if (torrent.hash === data.hash) {
        			torrent.dl(data.dl);
        			torrent.ul(data.ul);
        			updated = true;
        		}
        	}
        	if (!updated) {
        		this.torrents.unshift(new TorrentOperation(data));
        	}
        });
    }
    
    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: TorrentStatus, template: templateMarkup };
