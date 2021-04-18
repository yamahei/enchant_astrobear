/*
	感心。Firefox OSアプリはWebページからインストールでき、デスクトップでもAndroidでも動く！ | OpenWeb
	http://openweb.co.jp/2013/01/25/%E6%84%9F%E5%BF%83%E3%80%82firefox-os%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AFweb%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%8B%E3%82%89%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%A7%E3%81%8D/
	Apps - Web API インターフェイス | MDN
	https://developer.mozilla.org/ja/docs/Web/API/DOMApplicationsRegistry
*/

(function(global){

	var ffapp = function(){
		var thisUrl = location.href;
		this._manifestUrl = thisUrl.substring(0, thisUrl.lastIndexOf('/')) + '/manifest.webapp';
	};
	ffapp.prototype.checkInstalled = function checkInstalled(){
		if (global.navigator.mozApps) {
			return global.navigator.mozApps.checkInstalled(this._manifestUrl);
		} else {
			return true;//out of moz app
		}
	};
	ffapp.prototype.install = function install(){
		var request = global.navigator.mozApps.install(this._manifestUrl);
		request.onsuccess = function () {
			var appRecord = this.result;
			alert('Installation successful!');
		};
		request.onerror = function () {
			alert('Install failed, error: ' + this.error.name);
		};
	};
	ffapp.prototype.setManifestUrl = function setManifestUrl(manifestUrl){
		this._manifestUrl = manifestUrl;
	};

	global.ffapp = global.ffapp || new ffapp();

})(window);
