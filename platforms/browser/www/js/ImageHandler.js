let ImageHandler = function () {

    let lastbase64img;

    let _init = function()
    {

    };

    let _UpdateImage = function(input, callback) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let img = new Image();
                img.onload = function(){
                    //initialize Canvas
                    MaskHandler.setCanvas(document.getElementById('preview')); //Testing, replace with jQuery or smthing
                    MaskHandler.clearMask();
                    MaskHandler.canvasResize(img.width, img.height);
                    lastbase64img = img;
                    callback();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }

    };

    let _GetLastBase64img = function(){
        return lastbase64img;
    };

    let _SetLastBase64img = function(base64){
        lastbase64img = base64;
    };

    let _GetLastimg = function(){
        return convertBase64ToFile(lastbase64img.src);
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

    return {
        init: _init,
        UpdateImage: _UpdateImage,
        GetLastBase64img: _GetLastBase64img,
        SetLastBase64img: _SetLastBase64img,
        GetLastimg: _GetLastimg
    };
}();

ImageHandler.init();