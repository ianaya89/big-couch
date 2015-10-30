var videoFrame = {
    isWebKit: /AppleWebKit/gi.test(navigator.userAgent),
    jsonArr: [],
    dataScreenShots: [],
    isInitialized: !1,
    init: function() {
        function b() {
            if (/documentation/.test(location.hash)) {
                var a = $(document).scrollTop(), b = $("#methodToFrames").offset().top, c = $("#documentation .pull-left").offset().top, d;
                a >= b && (d = a - b);
                a >= c ? $("#documentation ul.nav").css({
                    position: "fixed",
                    top: (d ? "-" + d : "0") + "px"
                }) : $("#documentation ul.nav").css({
                    position: "static"
                })
            } else
                $("#documentation ul.nav").css({
                    position: "static"
                })
        }
        this.isWebKit ? 
        ($("html").removeClass("not-webkit"),
        _gaq.push(["_trackEvent", "AppStart", "isWebKit"])) : ($("#browser-not-supported").modal(),
        $('a[href="#documentation"]').tab("show"),
        _gaq.push(["_trackEvent", "AppStart", "isNotWebKit"]));
        _V_("videoPlayer", {
            controls: !1,
            autoplay: !1,
            loop: !1
        }, function() {
            this.src({
                type: "video/mp4",
                src: "assets/timecodedAssets/MP4/24fps.mp4"
            });
            this.load();
            this.volume(0);
            this.addEvent("play", function() {
                video.listen($("#currentMethod").attr("data-video-frame-method"));
                $("#playButton").html('<i class="icon-pause"></i>');
                _gaq.push(["_trackEvent", "VideoPlayer", "Start Playback"])
            }
            );
            this.addEvent("pause", function() {
                video.stopListen();
                $("#playButton").html('<i class="icon-play"></i>');
                _gaq.push(["_trackEvent", "VideoPlayer", "Pause Playback"])
            }
            );
            this.addEvent("ended", function() {
                this.cancelFullScreen();
                video.stopListen();
                $("#playButton").html('<i class="icon-play"></i>');
                _gaq.push(["_trackEvent", "VideoPlayer", "Video Ended"])
            }
            );
            this.addEvent("fullscreenchange", function() {
                this.isFullScreen && video.stopListen()
            }
            );
            _gaq.push(["_trackEvent", 
            "VideoPlayer", "init Success"])
        }
        );
        $(".frameRate").bind("click", function(a) {
            a.preventDefault();
            video.video.pause();
            video.stopListen();
            videoFrame.resetFrameCount();
            $("#playButton").html('<i class="icon-play"></i>');
            a = $(a.target);
            var b = a.closest("ul").attr("id");
            "frameRateMenu" === b ? ($("#currentFrameRate").html(a.attr("data-frame-rate")),
            b = a.attr("data-frame-rate").toLowerCase().replace(" ", "").replace(".", ""),
            video.frameRate = Number(a.html()),
            $("#trackFrameRate").html(Number(a.html())),
            _V_("videoPlayer").src({
                type: "video/mp4",
                src: "assets/timecodedAssets/MP4/" + b + ".mp4"
            })) : "videoFrameMethods" === b && (video.video.currentTime = 0,
            $("#currentMethod").html(a.html()).attr("data-video-frame-method", a.attr("data-video-frame-method")));
            _gaq.push(["_trackEvent", "VideoPlayer", "Source Change", a.attr("data-video-frame-method")])
        }
        );
        $(".updateConversionMethod").bind("click", function(a) {
            a.preventDefault();
            a = $(a.target);
            $("#currentConversionMethod").html(a.html()).attr("data-conversion-method", a.attr("data-conversion-method"));
            _gaq.push(["_trackEvent", 
            "Conversion", "Conversion Method Update", a.attr("data-conversion-method")])
        }
        );
        $(".updateConversionFrameRate").bind("click", function(a) {
            a.preventDefault();
            a = $(a.target);
            $("#currentConversionFrameRate").html(a.html()).attr("data-conversion-frame-rate", a.attr("data-conversion-frame-rate"));
            _gaq.push(["_trackEvent", "Conversion", "Frame Rate Update", a.attr("data-conversion-frame-rate")])
        }
        );
        $("#seekBackward").bind("click", function(a) {
            a.preventDefault();
            video.seekBackward($("#seekBackwardOver button.active").html(), 
            videoFrame.triggerFrameUpdate);
            _gaq.push(["_trackEvent", "VideoControls", "Seek", "Backward"])
        }
        );
        $("#seekForward").bind("click", function(a) {
            a.preventDefault();
            video.seekForward($("#seekForwardOver button.active").html(), videoFrame.triggerFrameUpdate);
            _gaq.push(["_trackEvent", "VideoControls", "Seek", "Forward"])
        }
        );
        $("#playButton").bind("click", videoFrame.toggleVideo);
        $("#captureScreenShot").bind("click", videoFrame.getScreenShot);
        $("#captureFrame").bind("click", videoFrame.addFrame);
        $("#convertSMPTEValue").bind("click", 
        videoFrame.convertSMPTE);
        $("#convertFrameValue").bind("click", videoFrame.convertFrame);
        $(document).bind("keydown", function(a) {
            var b = a.which || a.keyCode;
            if (a.shiftKey && (37 === b || 39 === b || 70 === b || 83 === b))
                switch (a.preventDefault(),
                b) {
                case 37:
                    $("#seekBackward").trigger("click");
                    break;
                case 39:
                    $("#seekForward").trigger("click");
                    break;
                case 70:
                    $("#captureFrame").trigger("click");
                    break;
                case 83:
                    $("#captureScreenShot").trigger("click")
                }
            32 === b && (a.preventDefault(),
            $("#playButton").trigger("click"))
        }
        );
        $("#videoControls").bind("hover", 
        function() {
            $("#seekForwardOver").is(":visible") || $("#seekForwardOver, #seekBackwardOver").dequeue().fadeIn("slow")
        }
        );
        $(".carousel").carousel({
            interval: 5E3,
            pause: "hover"
        });
        $(".triggerTooltip").tooltip();
        $(".triggerPopover").popover({
            trigger: "hover"
        });
        prettyPrint();
        $(".videoFrameIcon").mouseover(function() {
            $(this).css({
                fontSize: "210px"
            })
        }
        ).mouseout(function() {
            $(this).css({
                fontSize: "185px"
            })
        }
        );
        $('a[data-toggle="tab"]').bind("click", function() {
            var a = $(this).attr("href").replace("#", "");
            location.hash = 
            "!/" + a;
            _gaq.push(["_trackEvent", "Navigation", "Tabs", a])
        }
        );
        $("#documentation ul.nav li a").bind("click", function(a) {
            a.preventDefault();
            var b = $(this);
            $("#documentation .nav li.active").removeClass("active").after(function() {
                b.closest("li").addClass("active");
                var a = b.attr("href")
                  , c = b.data().hash;
                location.hash = "!" + c;
                $("html, body").animate({
                    scrollTop: $(a).offset().top
                }, 250);
                _gaq.push(["_trackEvent", "Navigation", "Documentation", a])
            }
            );
            return !1
        }
        );
        var c;
        $(window).bind("scroll", function() {
            clearTimeout(c);
            c = setTimeout(b, 15)
        }
        );
        $("#download-buttons .btn").bind("click", function() {
            var a = $(this).hasClass("btn-primary");
            _gaq.push(["_trackEvent", "Download", a ? "Minified" : "Development"])
        }
        );
        return this.routeApp()
    },
    routeApp: function() {
        if (!this.isInitialized) {
            var b = location.hash;
            /documentation/.test(b) && $('a[href="#documentation"]').tab("show").after(function() {
                switch (b) {
                case "#!/documentation/configuration":
                    $('a[href="#configuration"]').trigger("click");
                    break;
                case "#!/documentation/get":
                    $('a[href="#methodGet"]').trigger("click");
                    break;
                case "#!/documentation/toSMPTE":
                    $('a[href="#methodToSMPTE"]').trigger("click");
                    break;
                case "#!/documentation/seekForward":
                    $('a[href="#methodSeekForward"]').trigger("click");
                    break;
                case "#!/documentation/seekBackward":
                    $('a[href="#methodSeekBackward"]').trigger("click");
                    break;
                case "#!/documentation/toTime":
                    $('a[href="#methodToTime"]').trigger("click");
                    break;
                case "#!/documentation/toSeconds":
                    $('a[href="#methodToSeconds"]').trigger("click");
                    break;
                case "#!/documentation/toMilliseconds":
                    $('a[href="#methodToMilliseconds"]').trigger("click");
                    break;
                case "#!/documentation/toFrames":
                    $('a[href="#methodToFrames"]').trigger("click");
                    break;
                case "#!/documentation/listen":
                    $('a[href="#methodListen"]').trigger("click");
                    break;
                case "#!/documentation/stopListen":
                    $('a[href="#methodStopListen"]').trigger("click");
                    break;
                case "#!/documentation/FrameRates":
                    $('a[href="#propertyFrameRates "]').trigger("click")
                }
            }
            );
            this.isInitialized = !0;
            _gaq.push(["_trackEvent", "RouteApp", "Hash", b])
        }
    },
    resetFrameCount: function() {
        $("#trackSMPTE").html("00:00:00:00").removeClass("btn-success").addClass("btn-danger disabled");
        $("#trackFrames").html("0").removeClass("btn-success").addClass("btn-danger disabled");
        $("#trackTime").html("00:00:00").removeClass("btn-success").addClass("btn-danger disabled")
    },
    toggleVideo: function() {
        var b = _V_("videoPlayer");
        b.paused() ? b.play() : b.pause();
        _gaq.push(["_trackEvent", "VideoControls", "Playback", "Player State:" + (b.paused() ? "Paused" : "Playing")])
    },
    triggerFrameUpdate: function() {
        switch ($("#currentMethod").attr("data-video-frame-method")) {
        case "SMPTE":
            $("#trackSMPTE").html(video.toSMPTE()).removeClass("disabled btn-danger").addClass("btn-success");
            $("#SMPTE-timeCode").attr("placeholder", video.toSMPTE());
            break;
        case "time":
            $("#trackTime").html(video.toTime()).removeClass("disabled btn-danger").addClass("btn-success");
            break;
        case "frame":
            $("#trackFrames").html(Math.floor(video.get())).removeClass("disabled btn-danger").addClass("btn-success")
        }
    },
    convertSMPTE: function() {
        var b = $("#SMPTE-timeCode").val() || $("#SMPTE-timeCode").attr("placeholder")
          , c = $("#currentConversionMethod").attr("data-conversion-method");
        switch (c) {
        case "seconds":
            $("#convertedValue").html("<div>" + 
            video.toSeconds(b) + "</div>");
            break;
        case "milliseconds":
            $("#convertedValue").html("<div>" + video.toMilliseconds(b) + "</div>");
            break;
        case "frames":
            $("#convertedValue").html("<div>" + video.toFrames(b) + "</div>")
        }
        _gaq.push(["_trackEvent", "Conversion", "SMPTE to " + c])
    },
    convertFrame: function() {
        var b = $("#frame-number").val() || $("#frame-number").attr("placeholder");
        $("#convertedFrameValue").html("<div>" + video.toSMPTE(b) + "</div>");
        _gaq.push(["_trackEvent", "Conversion", "Frame to SMPTE"])
    },
    addFrame: function() {
        var b = 
        video.toSMPTE();
        videoFrame.jsonArr.push('{ "frame": "' + b + '" }');
        var c = $("#videoFrameTable tbody tr:last").clone().show();
        c.find("td").each(function() {
            var a = $(this);
            a.hasClass("frameID") ? a.html(1 + Number(a.html())) : a.hasClass("frameSMPTE") && a.html(b)
        }
        );
        $("#videoFrameTable tbody").append(c);
        $("#videoFrameResults").fadeIn("500");
        _gaq.push(["_trackEvent", "VideoControls", "SMPTE Time Code Captured"])
    },
    buildJSON: function() {
        var b = "[" + videoFrame.jsonArr.join(",") + "]";
        return JSON.parse(b)
    },
    getScreenShot: function(b) {
        var c = 
        video.toSMPTE()
          , a = document.createElement("canvas");
        a.width = video.video.videoWidth;
        a.height = video.video.videoHeight;
        a.getContext("2d").drawImage(video.video, 0, 0);
        a = a.toDataURL("image/jpeg");
        if ("dataURI" === b)
            return a;
        $("#videoFrameScreenshots ul").append('<li style="display:none;"><a href="javascript:void(0);" class="thumbnail"><img src="' + a + '" alt="' + c + '" /><p>' + c + "</p></a></li>").after(function() {
            $("#videoFrameScreenshots li").fadeIn("500")
        }
        );
        $("#videoFrameScreenshots").fadeIn("500");
        _gaq.push(["_trackEvent", 
        "VideoControls", "Thumbnail Generated"])
    },
    buildThumbnails: function() {
        var b = "[" + videoFrame.dataScreenShots.join(",") + "]";
        JSON.parse(b).forEach(function(b) {
            var a = document.createElement("img");
            a.className = "img-rounded img-polaroid";
            a.src = b.img;
            a.alt = b.frame;
            document.getElementById("videoFrameScreenshots").appendChild(a)
        }
        )
    }
};
