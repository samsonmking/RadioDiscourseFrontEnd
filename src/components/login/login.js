import ko from 'knockout';
import templateMarkup from 'text!./login.html';
import hasher from 'hasher';
import * as comm from '../communication';
import 'notifyjs';

class Login {
    constructor(params) {
        this.username = ko.observable();
        this.password = ko.observable();
    }

    login() {
    	var creds = {
			username: this.username(),
			password: this.password()
		};

		comm.postJSON('/auth', creds)
	    	.done((data) => {
	    		comm.setToken(data.auth_token);
				hasher.setHash('');
	    	})
	    	.fail((data) => {
	    		$.notify('Login Failed', 'error');
	    	});
    }


    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: Login, template: templateMarkup };
