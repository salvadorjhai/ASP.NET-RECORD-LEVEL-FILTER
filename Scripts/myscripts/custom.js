
/**
 * show sweetalert
 * @param {any} title
 * @param {any} text
 * @param {any} icon success, error, warning, info, question
 */
function swal(title, text, icon) {
    swal2({
        title: title,
        text: text,
        icon: icon,
        dangerMode: (icon == 'error' || icon == 'warning'),
    });
}

/**
 * show sweetalert
 * @param {any} opt options
 * @param {any} isConfirmedFunc function to call on btn confirmed click
 * @param {any} isCancelledFunc function to call on btn cancel/dismissed click
 */
function swal2(opt, isConfirmedFunc = null, isCancelledFunc = null) {
    if (opt.buttonsStyling == null) {
        opt.buttonsStyling = true
    }
    if (opt.allowOutsideClick == null) {
        opt.allowOutsideClick = false
    }
    if (opt.allowEscapeKey == null) {
        opt.allowEscapeKey = false
    }
    if (opt.stopKeydownPropagation == null) {
        opt.stopKeydownPropagation = true
    }
    if (opt.keydownListenerCapture == null) {
        opt.keydownListenerCapture = true
    }
    if (opt.showCloseButton == null) {
        opt.showCloseButton = true
    }
    if (opt.closeButtonHtml == null) {
        opt.closeButtonHtml = ''
    }

    if (opt.customClass == null) {
        // if dangerMode is set
        if (opt.dangerMode != null) {
            opt.customClass = {
                confirmButton: `btn btn-danger swal-btn-sz text-uppercase`,
                cancelButton: 'btn btn-success swal-btn-sz text-uppercase',
            }
        } else {
            opt.customClass = {
                confirmButton: `btn btn-success swal-btn-sz text-uppercase`,
                cancelButton: 'btn btn-primary swal-btn-sz text-uppercase',
            }
        }
    }

    if (opt.confirmButtonText == null) {
        opt.confirmButtonText = `<i class="far fa-thumbs-up"></i> Okay`
        opt.focusConfirm = true;
    }

    if (!(isConfirmedFunc === null)) {
        if (opt.showCancelButton == null) {
            opt.showCancelButton = true;
        }
        opt.focusConfirm = false;
        opt.focusCancel = true;
    }

    if (opt.showCancelButton && !opt.cancelButtonText) {
        opt.cancelButtonText = '<i class="far fa-thumbs-down"></i> Cancel';
    }

    if (opt.text && !opt.html) {
        opt.html = opt.text.replace('\n', '<br>');
        delete opt.text
    }

    if (!opt.returnFocus) {
        opt.returnFocus = false;
    }

    delete opt.dangerMode; //  no longer supported in sweetalert2

    Swal.fire(opt).then((result) => {
        if (result.isConfirmed) {
            setTimeout(isConfirmedFunc, 1);
        } else {
            setTimeout(isCancelledFunc, 1);
        }
    });
}

function ShowSwalLoader(title = 'Please wait...', text = 'Your request is being processed.') {
    Swal.fire({
        icon: 'info',
        title: title,
        text: text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
}

function CloseSwalLoader() {
    Swal.close()
}