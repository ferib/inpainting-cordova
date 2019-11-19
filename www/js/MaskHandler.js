let MaskHandler = function () {
    let canvas;
    let clickX;
    let clickY;
    let clickDrag;
    let paint;
    let sLineWidth = 20;

    let _init = function(){
        clickX = [];
        clickY = [];
        clickDrag = [];
    };

    //TEST1: document.getElementById("preview").appendChild(canvas)
    //TEST2: MaskHandler.setCanvas(document.getElementById("preview"));
    let _setCanvas = function(ParentObj)
    {
        canvas = document.createElement("canvas");
        canvas.setAttribute("id","canvas");
        ParentObj.appendChild(canvas);
    };

    let _canvasResize = function(width, height){
        if(canvas == null)
        {
            console.log("_canvasResize: Canvas not set");
            return;
        }
        canvas.setAttribute("width", width);
        canvas.setAttribute("height",height);
    };

    //clears the mask
   let _clearMask = function(){
       if(canvas == null)
       {
           console.log("_clearMask: Canvas not set");
           return;
       }
       clickX.length = 0;
       clickY.length = 0;
       clickDrag.length = 0;
       let context = canvas.getContext("2d");
       context.clearRect(0, 0, context.canvas.width, context.canvas.height); //Clear canvas
   };

    let _addClick = function(x, y, dragging){
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    };

    let _reDraw = function(){
        if(canvas == null)
        {
            console.log("_reDraw: Canvas not set");
            return;
        }
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

        context.strokeStyle = "#df4b26";
        context.lineJoin = "round";
        context.lineWidth = sLineWidth;

        for(let i=0; i < clickX.length; i++) {
            context.beginPath();
            if(clickDrag[i] && i){
                context.moveTo(clickX[i-1], clickY[i-1]);
            }else{
                context.moveTo(clickX[i]-1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
    };

    let _setLineWidth = function(newLineWith)
    {
        sLineWidth = newLineWith;
        _reDraw();
    };

   //converts canvas to blob
   let _canvasToFile = function(){
       if(canvas == null)
       {
           console.log("_canvasToFile: Canvas not set");
           return;
       }
        var canvasBase64 = canvas.toDataURL();
        return convertBase64ToFile(canvasBase64);
   };

    //snippets from Stackoverflow
    const convertBase64ToFile = function (image) {
        const byteString = atob(image.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {
            type: 'image/png',
        });
    };

    //snippets from Stackoverflow
    function _arrayBufferToBase64( buffer ) {
        let binary = '';
        let bytes = new Uint8Array( buffer );
        let len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

    //MouseEvents for Drawing
    let _OnMouseDown = function(e, offsetLeft, offsetTop){
        let mouseX = e.pageX - offsetLeft;
        let mouseY = e.pageY - offsetTop;

        paint = true;
        _addClick(mouseX, mouseY);
        _reDraw();
    };

    let _OnMouseMove = function(e, offsetLeft, offsetTop){
        if(paint){
            _addClick(e.pageX - offsetLeft, e.pageY - offsetTop, true);
            _reDraw();
        }
    };

    let _OnMouseUp = function(e)
    {
        paint = false;
    };

    let _OnMouseLeave = function(e) {
        paint = false;
    };

    let _getCanvas = function(){
        if(canvas == null)
        {
            console.log("_getCanvas: Canvas not set");
            return;
        }
        return canvas;
    };

    return {
        init: _init,
        canvasResize: _canvasResize,
        clearMask: _clearMask,
        canvasToFile: _canvasToFile,
        addClick: _addClick,
        reDraw: _reDraw,
        OnMouseDown: _OnMouseDown,
        OnMouseMove: _OnMouseMove,
        OnMouseUp: _OnMouseUp,
        OnMouseLeave: _OnMouseLeave,
        setCanvas: _setCanvas,
        getCanvas: _getCanvas,
        setLineWidth: _setLineWidth
    };
}();

MaskHandler.init();