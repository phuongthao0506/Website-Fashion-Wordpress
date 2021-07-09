(function () {
    window.lazySizesConfig = window.lazySizesConfig || {};
    window.lazySizesConfig.loadMode = 1;
    window.lazySizesConfig.expand = 1;
    window.lazySizesConfig.expFactor = 0.1;
    window.lazySizesConfig.hFac = 0.1;
    window.lazySizesConfig.throttleDelay = 0;
})();

const FIFU_PLACEHOLDER = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=';

function fifu_lazy() {
    jQuery('img').each(function (index) {
        fifu_add_placeholder(this);

        // dont touch on slider
        if (!jQuery(this).hasClass('fifu'))
            fifu_add_lazyload(this);
    });
    fifu_add_srcset();
}

function fifu_add_lazyload($) {
    jQuery($).addClass('lazyload');
}

function fifu_add_placeholder($) {
    clazz = jQuery($).attr('class');
    src = jQuery($).attr('src');
    datasrc = jQuery($).attr('data-src');
    if (!src && datasrc)
        jQuery($).attr('src', FIFU_PLACEHOLDER);
}

function fifu_add_srcset() {
    types = ['src', 'data-src'];
    for (i = 0; i < types.length; i++) {
        // jetpack
        jQuery('img[' + types[i] + '*=".wp.com/"]').each(function (index) {
            if (jQuery(this).attr('fifu-featured')) {
                isMain = jQuery(this).parents('.woocommerce-product-gallery__image').length == 1;
                src = jQuery(this).attr(types[i])
                srcset = jQuery(this).attr(types[i] + 'set');

                if (!srcset && !isMain) {
                    srcset = '';
                    sizes = [75, 100, 150, 240, 320, 500, 640, 800, 1024, 1280, 1600];
                    for (j = 0; j < sizes.length; j++)
                        srcset += ((j != 0) ? ', ' : '') + src.replace(src.split('?')[1], 'w=' + sizes[j] + '&resize=' + sizes[j] + '&ssl=1') + ' ' + sizes[j] + 'w';
                    jQuery(this).attr(types[i] + 'set', srcset);
                    jQuery(this).attr('data-sizes', 'auto');
                }
            }
        });
    }
}

document.addEventListener('lazybeforeunveil', function (e) {
    // background-image    
    var url = jQuery(e.target).attr('data-bg');
    if (url) {
        delimiter = fifu_get_delimiter(jQuery(e.target), 'data-bg');
        jQuery(e.target).css('background-image', 'url(' + fifu_get_delimited_url(url, delimiter) + ')');
    }

    // width & height
    // jQuery(e.target).attr('fifu-width', e.srcElement.clientWidth);
    // jQuery(e.target).attr('fifu-height', e.srcElement.clientHeight);
});

document.addEventListener('lazyunveilread', function (e) {
});

function fifu_get_delimiter($, attr) {
    return $[0].outerHTML.split(attr + '=')[1][0];
}

function fifu_get_delimited_url(url, delimiter) {
    return delimiter + url + delimiter;
}
