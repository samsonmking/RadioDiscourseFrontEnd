import 'jquery';
import 'bootstrap';
import ko from 'knockout';
import 'knockout-projections'
import * as router from './router';

// Components can be packaged as AMD modules, such as the following:
ko.components.register('nav-bar', { require: 'components/nav-bar/nav-bar' });
ko.components.register('torrent-search', { require: 'components/torrent-search/torrent-search' });
ko.components.register('torrent-status', { require: 'components/torrent-status/torrent-status' });

ko.components.register('login', { require: 'components/login/login' });

// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

// Start the application
ko.applyBindings({ route: router.currentRoute });
