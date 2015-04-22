jQuery(document).ready(function(){
    var scripts = document.getElementsByTagName("script");
    var jsFolder = "";
    for (var i= 0; i< scripts.length; i++)
    {
        if( scripts[i].src && scripts[i].src.match(/initaudioplayer-1\.js/i))
            jsFolder = scripts[i].src.substr(0, scripts[i].src.lastIndexOf("/") + 1);
    }
    jQuery("#amazingaudioplayer-1").amazingaudioplayer({
        jsfolder:jsFolder,
        skinsfoldername:"",
        tracklistarrowimage:"tracklistarrow-48-16-1.png",
        timeformatlive:"%CURRENT% / LIVE",
        volumeimagewidth:24,
        barbackgroundimage:"",
        showtime:true,
        titleinbarwidth:80,
        showprogress:true,
        random:false,
        titleformat:"%TITLE%",
        prevnextimagewidth:24,
        height:600,
        imageheight:100,
        loadingformat:"Loading...",
        prevnextimage:"prevnext-24-24-1.png",
        showinfo:false,
        tracklistitem:10,
        skin:"BarWhiteTitle",
        loopimage:"loop-24-24-2.png",
        loopimagewidth:24,
        showstop:false,
        prevnextimageheight:24,
        infoformat:"By %ARTIST% %ALBUM%<br />%INFO%",
        showloading:false,
        volumebarheight:80,
        tracklistarrowimagewidth:48,
        stopimagewidth:24,
        imagefullwidth:false,
        skinsfoldername:"",
        width:420,
        showtitleinbar:true,
        showtracklist:true,
        volumeimage:"volume-24-24-2.png",
        playpauseimagewidth:24,
        loopimageheight:24,
        tracklistitemformat:"%ID%. %TITLE% <span style='position:absolute;top:0;right:0;'>%DURATION%</span>",
        showloop:true,
        titleinbarwidthmode:"fixed",
        playpauseimageheight:24,
        showbackgroundimage:false,
        stopimage:"stop-24-24-1.png",
        showprevnext:true,
        backgroundimage:"",
        autoplay:true,
        volumebarpadding:8,
        progressheight:8,
        showtracklistbackgroundimage:false,
        showtitle:false,
        tracklistarrowimageheight:16,
        heightmode:"auto",
        titleinbarformat:"%TITLE%",
        stopimageheight:24,
        volumeimageheight:24,
        showbarbackgroundimage:false,
        fullwidth:false,
        tracklistbackgroundimage:"",
        showimage:false,
        imagewidth:100,
        timeformat:"%CURRENT% / %DURATION%",
        showvolume:true,
        showvolumebar:true,
        loop:1,
        playpauseimage:"playpause-24-24-1.png"
    });
});