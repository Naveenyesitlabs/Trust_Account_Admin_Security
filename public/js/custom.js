$(document).ready(function () {
    $('.toggleSwitch').change(function () {
        if ($(this).is(':checked')) {
            $('#suspend-pop').modal('show'); // Show suspend modal
        } else {
            $('#active-pop').modal('show'); // Show activate modal
        }
    });
});

// $(function () {
//     $("#datepicker-1").datepicker();
//     $("#datepicker-2").datepicker();
//     $("#datepicker-3").datepicker();
//     $("#datepicker-4").datepicker();
// });

// SIDEBAR-DROPDOWN

$(document).ready(function () {
    $('.sidebar-dropdown-btn').click(function () {
        $(".sidebar-dropdown-list").slideToggle('fast');
        $(".sidebar-dropdown-icon").toggleClass('active');
    });
});

// SIDEBAR-DROPDOWN

// DATPICKER

$(function () {

    $('input[name="datefilter"]').daterangepicker({
        autoUpdateInput: false,
        opens: 'left',
        startDate: moment().startOf('hour'),
        locale: {
            cancelLabel: 'Clear'
        }
    });
});

$('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
});

$('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
});


$(document).ready(function () {
    $('.applyBtn').click(function () {
        $('.daterange-btn input').css("width", "210px");
    });
    $('.cancelBtn').click(function () {
        $('.daterange-btn input').css("width", "160px");
    });
});

$(document).ready(function () {
    $('.applyBtn').click(function () {
        $('.daterange-btn-2 input').css("width", "210px");
    });
    $('.cancelBtn').click(function () {
        $('.daterange-btn-2 input').css("width", "100px");
    });
});


// DATPICKER


// DROPDOWN

$(document).ready(function () {
    $('.influ-drop-btn').click(function () {
        $(".influ-drop-list").not($(this).parent().find(".influ-drop-list").slideToggle('fast')).slideUp();
        event.stopPropagation();
    });

    $('.influ-drop-btn').click(function () {
        $(".far").not($(this).parent().find(".far").toggleClass('active')).removeClass('active');
    });

    $(document).click(function () {
        $('.influ-drop-list').slideUp('fast');
        $(".far").removeClass('active');
    });
    $('.influ-drop-list').click(function () {
        event.stopPropagation();
    });
});

// DROPDOWN


// MORE-DROPDOWN

$(document).ready(function () {
    $('.influ-more-drop-btn').click(function () {
        $(".influ-more-drop-list").not($(this).parent().find(".influ-more-drop-list").slideToggle('fast')).slideUp();
        event.stopPropagation();
    });

    $(document).click(function () {
        $('.influ-more-drop-list').slideUp('fast');
    });
    $('.influ-more-drop-list').click(function () {
        event.stopPropagation();
    });
});

// MORE-DROPDOWN

// FAQ-POP-SERVICE-DROPDOWN

$(document).ready(function () {
    $('.faq-dropdown-btn').click(function () {
        $(".faq-dropdown-list").slideToggle('fast');
        $(this).toggleClass('active');
        event.stopPropagation();
    });

    $(document).click(function () {
        $('.faq-dropdown-list').slideUp('fast');
        $('.faq-dropdown-btn').removeClass('active');
    });
});

// FAQ-POP-SERVICE-DROPDOWN

// PASSOWRD-HIDE-SHOW

$(function () {
    $('#eye').click(function () {
        if ($(this).hasClass('fa-eye-slash')) {
            $(this).removeClass('fa-eye-slash');
            $(this).addClass('fa-eye');
            $('#password').attr('type', 'text');
        } else {
            $(this).removeClass('fa-eye');
            $(this).addClass('fa-eye-slash');
            $('#password').attr('type', 'password');
        }
    });
});

// PASSOWRD-HIDE-SHOW




// TOGGLE SIDEBAR

const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

if (menuBar && sidebar) {
    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
    })
}

// TOGGLE SIDEBAR

// FAQ-MODAl

function openSuccessModal() {
    // Dismiss the first modal
    var firstModal = document.getElementById('add-faq-pop');
    var bootstrapModal = bootstrap.Modal.getInstance(firstModal);
    bootstrapModal.hide();

    // Open the second modal
    var secondModal = new bootstrap.Modal(document.getElementById('add-faq-succ-popup'));
    secondModal.show();
}

// FAQ-MODAl


jQuery(function ($) {
    $(".tutorial-video").each(function () {
        const $container = $(this);
        const $video = $container.find("video");
        const $playBtn = $container.find(".play-btn");

        $video.removeAttr("controls");

        $playBtn.on("click", function () {
            const videoEl = $video.get(0);
            videoEl.play();
            videoEl.controls = false;
            $playBtn.css("visibility", "hidden");
            return false;
        });

        $video.on("click", function () {
            const videoEl = $video.get(0);
            videoEl.pause();
            videoEl.controls = false;
            $playBtn.css("visibility", "visible");
            return false;
        });

        // Video end event
        $video.on("ended", function () {
            const videoEl = $video.get(0);
            videoEl.controls = false;
            $playBtn.css("visibility", "visible");
        });
    });
});



