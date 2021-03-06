/*************************
 INITIALIZE SLOT INDICATOR
 ************************/
var indicatorOn;
var slotNumber;
var initSlotIndicator = function () {
    indicatorOn = false;
    var slotAnimationLoop = function () {
        if (slotNumber != undefined) {
            $("#slotIndicator").text(slotNumber+1)
        } else {
            if(indicatorOn) {
                $("#slotIndicator").text("Loading")
            } else {
                $("#slotIndicator").text("")
            }
            indicatorOn = !indicatorOn;
            setTimeout(slotAnimationLoop, 500);
        }
    }
    slotAnimationLoop();
}

/**********************
 HAPTIC CALLBACK METHOD
 *********************/
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
var hapticCallback = function () {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
};

/****************
 MAIN ENTRY POINT
 ***************/
$( window ).load(function() {
    initSlotIndicator();

    document.addEventListener('touchend', function (event) {
        event.preventDefault();
        $(event.target).trigger('click');
    }, false);

    $("#type_1").on("click", function() {
        var btn = $(this)
        if (btn.hasClass("one_active")) {
            btn.removeClass("one_active").addClass("two_active").text("Mode 2")
            $("#leftPad").show()
        } else {
            btn.removeClass("two_active").addClass("one_active").text("Mode 1")
            $("#leftPad").hide()
        }
        hapticCallback();
    });

    $("#type_2").on("click", function() {
        var btn = $(this)
        if (btn.hasClass("one_active")) {
            btn.removeClass("one_active").addClass("two_active").text("Mode 2")
            $("#rightPad").show()
        } else {
            btn.removeClass("two_active").addClass("one_active").text("Mode 1")
            $("#rightPad").hide()
        }
        hapticCallback();
    });

    var getCodes = function (extra) {
        let data = {code1: 0x10, code2: 0x11, min: -1, max: 1}
        if (extra === "leftPad") {
            data = { code1: 0x00, code2: 0x01, min: 0, max: 255}
        } else if (extra === "rightPad") {
            data = { code1: 0x03, code2: 0x04, min: 0, max: 255}
        }
        return data
    }

    var invokeButton = function (code, enabled, extra) {
        if (!enabled && (code === "left" || code === "right" || code === "up" || code === "down")) {
            code = "none"
        }
        let axisCodes = getCodes(extra)
        let min = axisCodes.min
        let max = axisCodes.max
        let middle = min + (max - min) / 2
        switch (code) {
            case "left":
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code1, value: min});
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code2, value: middle });
                break;
            case "right":
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code1, value: max });
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code2, value: middle });
                break;
            case "up":
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code1, value: middle });
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code2, value: min });
                break;
            case "down":
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code1, value: middle });
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code2, value: max });
                break;
            case "none":
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code1, value: middle });
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code2, value: middle });
                break;
            default:
                socket.emit("padExEvent", { type: 0x01, code: code, value: enabled ? 1 : 0 });
                break;
        }
    }

    var socket = io();

    socket.on("gamepadExConnected", function(data) {
        slotNumber = data.padId;

        $(".g1, .g2, .g3").off("touchstart touchend");
        setDirection = function(){};

        $(".g1, .g2, .g3").on("touchstart", function() {
            var btn = $(this)
            console.log(btn);
            
            invokeButton($(this).data("code"), true, $(this).data("extra"))
            hapticCallback();
        });

        $(".g1, .g2, .g3").on("touchend", function() {
            var btn = $(this)
            invokeButton($(this).data("code"), false, $(this).data("extra"))
            //hapticCallback();
        });

    });

    socket.on("connect", function() {
        socket.emit("connectGamepadEx", null);
    });

    socket.on("disconnect", function() {
        location.reload();
    });
} );