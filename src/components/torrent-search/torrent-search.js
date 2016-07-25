import ko from 'knockout';
import 'notifyjs';
import templateMarkup from 'text!./torrent-search.html';

class Torrent {
	constructor(data) {
		this.encoding = ko.observable(data.encoding);
		this.format = ko.observable(data.format);
		this.id = data.id;
		this.media = ko.observable(data.media);
		this.remastered = data.remastered;
		this.remasterYear = data.remasterYear;
		this.scene = data.scene;
		this.size = ko.observable(data.size);
		this.formatStr = ko.computed(() => {
			return this.format() + ' / ' + this.encoding() + ' / ' + this.media(); 
		});
		this.sizeMb = ko.computed(() => {
			var mb = this.size() / 1000000
			return parseFloat(mb).toFixed(2) + ' mb';
		});
	}
}

class TorrentGroup {
	constructor(data) {
		this.groupName = data.groupName;
		this.groupYear = data.groupYear;
		this.groupRecordLabel = data.groupRecordLabel;
		this.torrents = ko.observableArray();
		this.image = data.wikiImage;
	}
}

class TorrentSearch {
    constructor(params) {
    	this.whatBaseUri = 'http://192.168.56.2:5000/rd/api/whatcd';
    	this.torrentBaseUri = 'http://192.168.56.2:5000/rd/api/torrent';
    	this.artistSearch = ko.observable();
    	this.artistName = ko.observable();
    	this.artistResults = ko.observableArray();

    	this.downloadTorrent = (torrent) => {
    	var url = this.torrentBaseUri + '/' + torrent.id;
	    	$.post(url)
	    		.done((reply) => {
	    			$.notify(reply.name + " added successfully", "success");
	    		})
	    		.fail((reply) => {
	    			$.notify(reply.name + " failed", "error");
	    		});
	    }

    	this.searchArtist = () => {
	    	var noSpace = this.artistSearch().replace(' ', '+');
	    	var url = this.whatBaseUri + '?artist_search=' + noSpace;
	    	$.getJSON(url)
	    		.done((reply) => {
	    			this.artistName(reply.artist_search);
	    			// Map Torrent Groups (Albums)
	    			var koGroups = $.map(reply.results, (tg) => {
	    				var koTg = new TorrentGroup(tg);
	    				// Map Torrents per group
	    				var koTorrents = $.map(tg.torrent, (tor) => {
	    					return new Torrent(tor);
	    				});
	    				koTg.torrents(koTorrents);
	    				return koTg;
	    			});
	    			this.artistResults(koGroups);
	    		})
	    		.fail((reply) => {
	    			console.log(reply);
	    		});
    	}
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: TorrentSearch, template: templateMarkup };
