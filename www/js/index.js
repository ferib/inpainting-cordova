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
                //.css("background-size", c.width + "px " + c.height + "px")
                //.css("width", c.width + "px")
                //.css("height", c.height + "px")
                //.css("min-height", c.height + "px")
                .css("background-image", "url('" + img.src + "')");
        });
    });

    $('#inpaint').click(function () {
        $('#preview').addClass("img-busy");
        $("#inpaint").addClass("btn-hide");
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
            $("#inpaint").removeClass("btn-hide");
            $("#mask").addClass("mask-finished");
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
        console.log("load galery");
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
    /*
    $('#preview').mouseup(function(e){
        MaskHandler.OnMouseUp(e);
    });
    $('#preview').mouseleave(function(e){
        MaskHandler.OnMouseLeave(e);
    });
     */
});

