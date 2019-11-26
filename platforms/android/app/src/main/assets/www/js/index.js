var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('mousedown', this.onmousedown.bind(this), false);
        document.addEventListener('mousemove', this.onmousemove.bind(this), false);
        document.addEventListener('mouseup', this.onmouseup.bind(this), false);
        document.addEventListener('mouseleave', this.onmouseleave.bind(this), false);
        //Mobile
        /*document.addEventListener('touchstart', this.onmousedown.bind(this), false);
        document.addEventListener('touchmove', this.onmousemove.bind(this), false);
        document.addEventListener('touchend', this.onmouseleave.bind(this), false);*/

        //Debugging Rotation plugin
       /* window.addEventListener("orientationchange", function(){
            console.log(screen.orientation.type); // e.g. portrait
        });

        //main app - ca-app-pub-8014088211781182~9779710924

        // Set AdMobAds options:
        alert(admob);
        admob.setOptions({
            publisherId:           "ca-app-pub-8014088211781182~9779710924",  // Required
            //interstitialAdId:      "ca-app-pub-8014088211781182/9599747523",  // Optional
            //autoShowBanner:        true,                                      // Optional
            //autoShowRInterstitial: false,                                     // Optional
            //autoShowRewarded:      false,                                     // Optional
            //tappxIdiOS:            "/XXXXXXXXX/Pub-XXXX-iOS-IIII",            // Optional
            //tappxIdAndroid:        "/XXXXXXXXX/Pub-XXXX-Android-AAAA",        // Optional
            //tappxShare:            0.5                                        // Optional
        });

        // Start showing banners (atomatic when autoShowBanner is set to true)
        //admob.createBannerView();
        admob.createBannerView({publisherId: "ca-app-pub-8014088211781182/9599747523"}); //process_inpaint
        admob.createBannerView({publisherId: "ca-app-pub-8014088211781182/4099653614"}); //process_banner
*/
        // Request interstitial ad (will present automatically when autoShowInterstitial is set to true)
        //admob.requestInterstitialAd();

        // Request rewarded ad (will present automatically when autoShowRewarded is set to true)
        //admob.requestRewardedAd();

        //Splash screen manualy
        /*navigator.splashscreen.show();
        window.setTimeout(function () {
            navigator.splashscreen.hide();
        }, 1500);*/

    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        window.screen.orientation.lock("portrait-primary");

        AdHandler.init();
    },

    onmousedown: function(e)
    {
        //MaskHandler.OnMouseDown(e, this.offsetLeft, this.offsetTop);
        //console.log(e);
    },

    onmousemove: function(e)
    {
        //MaskHandler.OnMouseMove(e, this.offsetLeft, this.offsetTop);
        //console.log("onmousemove: " + e);
    },

    onmouseup: function(e)
    {
        //MaskHandler.OnMouseUp(e);
        //console.log("onmouseup: " + e);
    },

    onmouseleave: function(e)
    {
        //MaskHandler.OnMouseLeave(e);
        //console.log("onmouseleave: " + e);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    }
};

$(function(){


    //Image uploaded
    $("#Image").change(function(){
        //init canvas
        MaskHandler.removeCanvas();
        ImageHandler.UpdateImage(this, function(){
            $('#preview-note').css("visibility", "hidden");
            $(this).css("visibility", "hidden");

            let img = ImageHandler.GetLastBase64img();

            $('#Image')
                .css("position", "absolute")
                .css("visibility", "hidden");
            $('#preview')
                .css("background-image", "url('" + img.src + "')");
        });
    });

    $('#inpaint').click(function () {
        $('#preview').addClass("img-busy");
        $("#inpaint").attr("disabled",true);
        $("#reset").attr("disabled",true);
        $("#galery").attr("disabled",true);

        $('#mask').attr("src", MaskHandler.getCanvas().toDataURL())
            .removeClass("mask-finished");

        var canvasFile = MaskHandler.canvasToFile();
        //MaskHandler.removeCanvas(); //delete canvas to make space for img #Mask
        MaskHandler.getCanvas().style.display = "none";
        Inpaint.inpaintImage(ImageHandler.GetLastimg(), canvasFile, function(){
            //callback on image done
            MaskHandler.clearMask();
            $('#preview').css("background-image", "url('data:image/png;base64," + Inpaint.getLastResponse() + "')")
                .removeClass("img-busy");
            $("#mask").addClass("mask-finished");
            $("#inpaint").attr("disabled",false);
            $("#reset").attr("disabled",false);
            $("#galery").attr("disabled",false);
        });
    });

    $("#masksize-slider").change(function(){
        MaskHandler.setLineWidth(this.value);
    });

    $("#reset").click(function(){
        if(MaskHandler.isCanvasUsed())
        {
            MaskHandler.clearMask();
        }else{
            MaskHandler.getCanvas().style.display = "none";
            $("#inpaint").removeClass("btn-hide");
            $('#preview').css("background-image", "")
                .removeClass("img-busy");
            $("#mask").addClass("mask-finished")
                .attr("src","");
            $('#Image')
                .css("position", "relative")
                .css("visibility", "visible")
                .val('');
            $('#preview-note').css("visibility", "visible");
        }
    });

    $("#undo").click(function(){
        MaskHandler.removeLastPaint();
    });

    $("#galery").click(function(){
        updateGalery();
    });

    $("#galery-close-bottom, #galery-close-top").click(function(){
        $("#content").css("display","block");
        $("#img-galery").css("display","none");
    });

    $(document).on("click",".close", function(){
        window.localStorage.setItem($(this).context.id,"removed");
        updateGalery();
    });

    //Mouse events
    $('#preview').mousedown(function(e){
        let c = MaskHandler.getCanvas();
        if(c != null)
        {
            let f = c.width / $(this).width();
            MaskHandler.OnMouseDown(e, this.offsetLeft, this.offsetTop, f);
        }
    }).mousemove(function(e){
        let c = MaskHandler.getCanvas();
        if(c != null)
        {
            let f = c.width / $(this).width();
            MaskHandler.OnMouseMove(e, this.offsetLeft, this.offsetTop, f);
        }
    }).mouseleave(function (e) {
        MaskHandler.OnMouseLeave(e);
    }).mouseup(function(e){
        MaskHandler.OnMouseUp(e);
    }).on({ 'touchstart' :function(e) {
        let c = MaskHandler.getCanvas();
        if (c != null) {
            let f = c.width / $(this).width();
            MaskHandler.OnMouseDown(e, this.offsetLeft, this.offsetTop, f);
        }
    }}).on({ 'touchmove' :function(e) {
            let c = MaskHandler.getCanvas();
            if (c != null) {
                let f = c.width / $(this).width();
                MaskHandler.OnMouseMove(e, this.offsetLeft, this.offsetTop, f);
            }
    }}).on({ 'touchup' :function (e) {
        MaskHandler.OnMouseLeave(e);
    }});
/*
    $('#preview').touchstart(function (e){
        let c = MaskHandler.getCanvas();
        if(c != null)
        {
            let f = c.width / $(this).width();
            MaskHandler.OnMouseDown(e, this.offsetLeft, this.offsetTop, f);
        }
    }).bind('touchend', function(e){
        MaskHandler.OnMouseUp();
    });
*/
});

function updateGalery(){
    $("#galery-list").empty();
    $("#content").css("display","none");
    $("#img-galery").css("display","block");

    for(let i = 0; i < window.localStorage.length; i++)
    {
        let currentItem = window.localStorage.getItem("ls-img-id-" + i);
        if(currentItem != null && currentItem != "removed")
        {
            $("#galery-list").prepend( "<li><div class='img-box'><span class='close' id='ls-img-id-" + i + "'>&times;</span><img class='galery-img' src=" + currentItem + "></div></li>");
        }
    }
}

app.initialize();
