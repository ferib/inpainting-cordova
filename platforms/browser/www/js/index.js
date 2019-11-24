var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('mousedown', this.onmousedown.bind(this), false);
        document.addEventListener('mousemove', this.onmousemove.bind(this), false);
        document.addEventListener('mouseup', this.onmouseup.bind(this), false);
        document.addEventListener('mouseleave', this.onmouseleave.bind(this), false);

        //Debugging Rotation plugin
        window.addEventListener("orientationchange", function(){
            console.log(screen.orientation.type); // e.g. portrait
        });

        //Splash screen manualy
        /*navigator.splashscreen.show();
        window.setTimeout(function () {
            navigator.splashscreen.hide();
        }, 1500);
*/
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        window.screen.orientation.lock("portrait-primary");
        console.log(navigator.camera);
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
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

$(function(){

    //Image uploaded
    $("#Image").change(function(){
        //init canvas
        MaskHandler.removeCanvas();
        ImageHandler.UpdateImage(this, function(){
            $('#preview-note').css("visibility", "hidden");
            $(this).css("visibility", "hidden");

            let img = ImageHandler.GetLastBase64img();
            let c = MaskHandler.getCanvas();

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
        MaskHandler.getCanvas().style.display = "none";
        $("#inpaint").removeClass("btn-hide");
        $('#preview').css("background-image", "")
            .removeClass("img-busy");
        $("#mask").addClass("mask-finished")
            .attr("src","");
        $('#Image')
            .css("position", "relative")
            .css("visibility", "visible");
        $('#preview-note').css("visibility", "visible");
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
            MaskHandler.OnMouseDown(e, this.offsetLeft, this.offsetTop, f);
        }
    }).mouseleave(function (e) {
        MaskHandler.OnMouseLeave(e);
    }).mouseup(function(e){
        MaskHandler.OnMouseUp(e);
    })

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

function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

function openCamera(selection) {

    var srcType = Camera.PictureSourceType.CAMERA;
    var options = setOptions(srcType);
    var func = createNewFileEntry;

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        displayImage(imageUri);
        // You may choose to copy the picture, save it somewhere, or upload.
        func(imageUri);

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}