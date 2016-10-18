import ko from 'knockout';
import 'notifyjs';
import he from 'he';
import templateMarkup from 'text!./torrent-search.html';
import * as comm from 'comm';
import hasher from 'hasher';

class Torrent {
	constructor(data) {
		this.encoding = ko.observable(data.encoding);
		this.format = ko.observable(data.format);
		this.id = data.id;
		this.media = ko.observable(data.media);
		this.remastered = ko.observable(data.remastered);
		this.remasterYear = ko.observable(data.remasterYear);
		this.remasterTitle = ko.observable(data.remasterTitle);
		this.scene =ko.observable(data.scene);
		this.size = ko.observable(data.size);
		this.formatStr = ko.computed(() => {
			return this.format() + ' / ' + this.encoding() + ' / ' + this.media(); 
		});
		this.moreFormat = ko.computed(() => {
			if (this.scene()) return "Scene";
			if (this.remastered()) {
				return this.remasterTitle() + ' - ' + this.remasterYear();
			}
		});
		this.sizeMb = ko.computed(() => {
			var mb = this.size() / 1000000
			return parseFloat(mb).toFixed(2) + ' mb';
		});
	}
}

class TorrentGroup {
	constructor(data) {
		this.groupName = ko.observable(data.groupName);
		this.groupYear = data.groupYear;
		this.groupRecordLabel = ko.observable(data.groupRecordLabel);
		this.torrents = ko.observableArray();
		this.image = data.wikiImage;
		this.albumName = ko.computed(() => {
			return he.decode(this.groupName());
		});
		this.recordLabel = ko.computed(() => {
			return he.decode(this.groupRecordLabel());
		});
	}
}

class TorrentSearch {
    constructor(params) {
    	this.artistSearch = ko.observable();
    	this.artistName = ko.observable();
    	this.artistResults = ko.observableArray();
    	this.loading = ko.observable(false);

    	comm.renewToken();
    }

    downloadTorrent(torrent) {
		var url = '/torrent/' + torrent.id;
    	comm.postJSONAuth(url)
    		.done((reply) => {
    			$.notify(reply.name + " added successfully", "success");
    		})
    		.fail((reply) => {
    			if (reply.status === 401) hasher.setHash('login');
    			$.notify(reply.responseText, "error");
    			console.log(reply);
    		});
	}

    searchArtist() {
    	var noSpace = this.artistSearch().replace(' ', '+');
    	var url = '/whatcd' + '?artist_search=' + noSpace;
    	this.loading(true);
    	comm.getJSONAuth(url)
    		.done((reply) => {
    			this.loading(false);
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
    			this.loading(false);
    			$.notify(reply.responseText, "error");
    			console.log(reply);
    			if (reply.status === 401) hasher.setHash('login');
    		});
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: TorrentSearch, template: templateMarkup };
