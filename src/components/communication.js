import hasher from 'hasher';

var baseUrl = 'http://192.168.56.2:5000/rd/api';

function postJSONAuth (url, data) {
	return $.ajax({
        beforeSend: (request) => {
                request.setRequestHeader('Authorization', 'Bearer ' + getToken());
            },
		url: baseUrl + url,
		method: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(data)
	});
}

function postJSON(url, data) {
    return $.ajax({
        url: baseUrl + url,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data)
    });
}

function getJSONAuth (url) {
	return $.ajax({ 
    		beforeSend: (request) => {
    			request.setRequestHeader('Authorization', 'Bearer ' + getToken());
    		},
    		url: baseUrl + url,
    		dataType: 'json'
	});
}

function getToken() {
    return localStorage.getItem("token");
}

function setToken(token) {
    return localStorage.setItem("token", token);
}

function renewToken() {
    return new Promise((resolve, reject) => {
        getJSONAuth('/auth')
            .done((data) => {
                setToken(data.auth_token);
                resolve();
            })
            .fail((data) => {
                hasher.setHash('login');
            });
    });
}

export { postJSONAuth, postJSON, getJSONAuth, getToken, setToken, renewToken};
