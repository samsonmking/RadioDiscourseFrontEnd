import ko from 'knockout';
import templateMarkup from 'text!./torrent-status.html';
import io from 'socketio';

class TorrentOperation {
	constructor(data) {
		this.name = data.name,
		this.id = data.id,
		this.hash = data.hash,
		this.size = data.size,
		this.dl = ko.observable(data.dl),
		this.ul = ko.observable(data.ul)
	}
}

class TorrentStatus {
    constructor(params) {
        this.torrents = ko.observableArray();

        var socket = io.connect('http://192.168.56.2:5000/socket')
        socket.on('torrentList', (data) => {
        	var koTorrents = $.map(data, (torrent) => {
        		return new TorrentOperation(torrent);
        	});
        	this.torrents(koTorrents);
        });
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
        		this.torrents.push(new TorrentOperation(data));
        	}
        });
    }
    
    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: TorrentStatus, template: templateMarkup };
