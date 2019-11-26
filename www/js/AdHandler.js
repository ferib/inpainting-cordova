let AdHandler = function () {

    let AdBannerTimeout = 120000; //90sec
    let AdBannerParent = "#ad-banner";
    let AdIntersitialParent = "#ad-intersitial";

    let _init = function(){
        admob.banner.config({
            id: 'ca-app-pub-8014088211781182/4099653614',
            isTesting: true,
            overlap: true,
            autoShow: true
        });

        admob.interstitial.config({
            id: 'ca-app-pub-8014088211781182/9599747523',
            isTesting: true,
            autoShow: false
        });

        admob.rewardvideo.config({
            id: 'ca-app-pub-8014088211781182/8312863819',
            isTesting: true,
            autoShow: false
        });

        admob.interstitial.prepare();
        //admob.rewardvideo.prepare();

        _initAdBanner();
        _startAdBanner();
    };

    let _startAdBanner = function(){
        setInterval(function (){
            _renewAdBanner();
        },AdBannerTimeout);
    };

    let _setAdBannerTimeout = function(timeout){
        AdBannerTimeout = timeout;
        console.log("AddBannerTimeout: " + AdBannerTimeout);
    };

    let _initAdBanner = function(){
        //$(AdBannerParent).empty()
        //    .prepend('<div class="test-ad-banner" style="background-color:' + getRandomColor() + ';"></div>');

        admob.banner.prepare();
        admob.banner.show();
    };

    let _renewAdBanner = function(){
        admob.banner.remove();
        admob.banner.prepare();
        admob.banner.hide();
        admob.banner.show();
    };

    let _initInpaintProcessAd = function(){
        admob.interstitial.show();
        //admob.rewardvideo.show();
        //$(AdIntersitialParent).empty()
        //    .prepend('<div class="test-ad-intersitial" style="background-color:' + getRandomColor() + ';"></div>')
        //    .addClass("test-ad-frame2");
    };

    let _hideInpaintProcessAd = function(){
        admob.interstitial.prepare();
        //admob.rewardvideo.prepare();
       // $(AdIntersitialParent).empty()
       //     .removeClass("test-ad-frame2");
    };

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return {
        init: _init,
        setAdBannerTimeout: _setAdBannerTimeout,
        initInpaintProcessAd: _initInpaintProcessAd,
        hideInpaintProcessAd: _hideInpaintProcessAd
    };
}();

