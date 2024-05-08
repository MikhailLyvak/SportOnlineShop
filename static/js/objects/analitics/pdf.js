jQuery(document).ready(function() {
    $('#download-pdf-1').click(function() {
        print_first()
    });
});


jQuery(document).ready(function() {
    $('#download-pdf-2').click(function() {
        print_second()
    });
});

jQuery(document).ready(function() {
    $('#download-pdf-3').click(function() {
        print_thirth()
    });
});

jQuery(document).ready(function() {
    $('#download-pdf-4').click(function() {
        print_forth()
    });
});

function print_first() {
    document.getElementById('print-styles-first').setAttribute('media', 'all');
    window.print();
    document.getElementById('print-styles-first').setAttribute('media', 'print and (print-section: analytics_first)');
  }


function print_second() {
    document.getElementById('print-styles-second').setAttribute('media', 'all');
    window.print();
    document.getElementById('print-styles-second').setAttribute('media', 'print and (print-section: analytics_second)');
  }

function print_thirth() {
    document.getElementById('print-styles-thirth').setAttribute('media', 'all');
    window.print();
    document.getElementById('print-styles-thirth').setAttribute('media', 'print and (print-section: analytics_thirth)');
  }

function print_forth() {
    document.getElementById('print-styles-forth').setAttribute('media', 'all');
    window.print();
    document.getElementById('print-styles-forth').setAttribute('media', 'print and (print-section: analytics_forth)');
  }
