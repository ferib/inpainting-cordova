var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('mousedown', this.onmousedown.bind(this), false);
        document.addEventListener('mousemove', this.onmousemove.bind(this), false);
        document.addEventListener('mouseup', this.onmouseup.bind(this), false);
        document.addEventListener('mouseleave', this.onmouseleave.bind(this), false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
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
        MaskHandler.OnMouseUp(e);
        //console.log("onmouseup: " + e);
    },

    onmouseleave: function(e)
    {
        MaskHandler.OnMouseLeave(e);
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
        $("#inpaint").attr("disabled","true");
        $("#reset").attr("disabled","true");
        $("#galery").attr("disabled","true");

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
            $("#inpaint").attr("disabled","false");
            $("#reset").attr("disabled","false");
            $("#galery").attr("disabled","false");
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
        $("#galery-list").empty();
        $("#content").css("display","none");
        $("#img-galery").css("display","block");

        for(let i = 0; i < window.localStorage.length; i++)
        {
            let currentItem = window.localStorage.getItem(i);
            if(currentItem == null){ continue; }

            $("#galery-list").prepend( "<li><img class='galery-img' src=" + currentItem + "></li>");
        }
    });

    $("#galery-close-bottom, #galery-close-top").click(function(){
        $("#content").css("display","block");
        $("#img-galery").css("display","none");
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
    });

});

