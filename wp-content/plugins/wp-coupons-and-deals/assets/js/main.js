// all coupons archive nav active
/* eslint-disable */
jQuery(document).ready(function ($) {
    function wpcd_moreLessDescription(mLDElements) {
        let num_words = Number(wpcd_main_js.word_count);

        let full_description, more, less;
        if(!mLDElements) {
            full_description = $('.wpcd-full-description');
            more = $('.wpcd-more-description');
            less = $('.wpcd-less-description');
        } else {
            full_description = mLDElements.fullDescription;
            more = mLDElements.more;
            less = mLDElements.less;
        }

        full_description.each(function () {
            $this = $(this);

            var full_content = $this.html();
            var check = full_content.split(' ').length > num_words;
            if (check) {
                var short_content = full_content.split(' ').slice(0, num_words).join(' ');
                $this.siblings('.wpcd-short-description').html(short_content + '...');
                $this.hide();
                $this.siblings('.wpcd-less-description').hide();
            } else {
                $(this).siblings('.wpcd-more-description').hide();
                $(this).siblings('.wpcd-more-description');
                $(this).siblings('.wpcd-less-description').hide();
                $(this).siblings('.wpcd-short-description').hide();
            }
        });
        // more and less link
        more.click(function (e) {
            e.preventDefault();
            $(this).siblings('.wpcd-full-description').show();
            $(this).siblings('.wpcd-less-description').show();
            $(this).siblings('.wpcd-short-description').hide();
            $(this).hide();

        });
        less.click(function (e) {
            e.preventDefault();
            $(this).siblings('.wpcd-short-description').show();
            $(this).siblings('.wpcd-more-description').show();
            $(this).siblings('.wpcd-full-description').hide();
            $(this).hide();
        });
    };
    wpcd_moreLessDescription();


    $.each($('#wpcd_cat_ul > li'), function () {
        if ($(this).children('a').attr('href') === window.location.href) {
            $(this).children('a').addClass('active');
        }
    });
    // $('#wpcd_cat_ul .wpcd_category').on('click', function (e) {
    //     e.preventDefault();
    //     if ($(this).attr('data-category') !== 'all') {
    //         $('.wpcd_item').hide();
    //         $('.' + $(this).attr('data-category')).fadeIn();
    //     } else {
    //         $('.wpcd_item').fadeIn();
    //     }
    // });
    var categories_pagination_set_timeout;
    var wpcd_js_data_tax = 'data-category';
    if ($('#wpcd_cat_ul .wpcd_category').attr('data-category')) {
        wpcd_js_data_tax = 'data-category';
    } else if ($('#wpcd_cat_ul .wpcd_category').attr('data-vendor')) {
        wpcd_js_data_tax = 'data-vendor';
    }

    const wpcd_coupon_template = $('#wpcd_coupon_template');
    const infinite_scroll_in_archive = wpcd_coupon_template.attr('wpcd-data-infinite_scroll_in_archive');
    if(infinite_scroll_in_archive) {
        function infiniteScroll() {
            let wpcdCouponPaginationWr = document.querySelector('#wpcd_coupon_pagination_wr');
            if(wpcdCouponPaginationWr) {
                const scrollAmount = document.documentElement.scrollTop || document.body.scrollTop;
                const pagWpCoordsY = wpcdCouponPaginationWr.getBoundingClientRect().top + window.pageYOffset;
                const windowHeight = window.innerHeight;
                if ((scrollAmount + windowHeight) >= pagWpCoordsY) {

                    let hrefEl = wpcdCouponPaginationWr.querySelector('.current').nextElementSibling;
                    if(hrefEl) {
                        window.removeEventListener('scroll', infiniteScroll);
                        let href = hrefEl.getAttribute('href');
                        let href_arr = wpcd_getUrlVar(href);
                        let wpcd_page_num = href_arr['wpcd_page_num'];
                        let wpcd_coupon_taxonomy = href_arr['wpcd_category'];
                        if (!wpcd_coupon_taxonomy) {
                            wpcd_coupon_taxonomy = href_arr['wpcd_vendor'];
                        }
                        let search_text = href_arr['search_text'];
                        let action = wpcdCouponPaginationWr.getAttribute('wpcd-data-action');
                        wpcd_ajaxCouponCategoriesPagination(wpcd_page_num, action, wpcd_js_data_tax, wpcd_coupon_taxonomy, search_text, true);
                    }
                }
            }
        }

        window.addEventListener('scroll', infiniteScroll);
    }

    function wpcd_ajaxCouponCategoriesPagination(wpcd_page_num, action, wpcd_js_data_tax, wpcd_coupon_taxonomy, search_text, infinite_scroll) {
        let wpcdCouponLoader = document.querySelector('.wpcd_coupon_loader');
        if (!infinite_scroll) {
            let scrollTop = $('#wpcd_coupon_template').offset().top;
            $('html, body').animate({scrollTop: scrollTop}, 300);
        } else {
            wpcdCouponLoader.classList.add('wpcd_coupon_loader_infinite_scroll');
        }

        wpcdCouponLoader.classList.remove('wpcd_coupon_hidden_loader');
        clearTimeout(categories_pagination_set_timeout);
        categories_pagination_set_timeout = setTimeout(function () {
            var coupon_template;
            var coupon_items_count;
            var coupon_sortby;
            var coupon_exclude_cat;
            var wpcd_data_coupon_page_url;
            var wpcd_data_category_coupons;
            var wpcd_data_vendor_coupons;
            var wpcd_data_ven_cat_id;
            var wpcd_coupon_taxonomy_category;
            var wpcd_coupon_taxonomy_vendor;
            if ( wpcd_js_data_tax == 'data-category' ) {
                var wpcd_coupon_taxonomy_category = wpcd_coupon_taxonomy;
            } else if ( wpcd_js_data_tax == 'data-vendor' ) {
                var wpcd_coupon_taxonomy_vendor = wpcd_coupon_taxonomy;
            }
            var wpcd_coupon_template = $( '#wpcd_coupon_template' );
            if ( wpcd_coupon_template.length > 0 ) {
                coupon_template = wpcd_coupon_template.attr( 'wpcd-data-coupon_template' );
                coupon_items_count = wpcd_coupon_template.attr( 'wpcd-data-coupon_items_count' );
                coupon_sortby = wpcd_coupon_template.attr( 'wpcd-data-coupon_sortby' );
                coupon_exclude_cat = wpcd_coupon_template.attr( 'wpcd-data-coupon_exclude_cat' );
                wpcd_data_coupon_page_url = wpcd_coupon_template.attr( 'wpcd-data-coupon_page_url' );
                wpcd_data_category_coupons = wpcd_coupon_template.attr( 'wpcd-data_category_coupons' );
                wpcd_data_vendor_coupons = wpcd_coupon_template.attr( 'wpcd-data_vendor_coupons' );
                wpcd_data_ven_cat_id = wpcd_coupon_template.attr( 'wpcd-data_ven_cat_id' );
            }
            if (!coupon_template) {
                coupon_template = undefined;
            }
            if (!wpcd_page_num) {
                wpcd_page_num = undefined;
            }
            if (!search_text) {
                search_text = undefined;
            }

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: wpcd_object.ajaxurl,
                data: {
                    action: action,
                    security: wpcd_object.security,
                    wpcd_category: wpcd_coupon_taxonomy_category,
                    wpcd_vendor: wpcd_coupon_taxonomy_vendor,
                    coupon_template: coupon_template,
                    coupon_items_count: coupon_items_count,
                    coupon_sortby: coupon_sortby,
                    coupon_exclude_cat: coupon_exclude_cat,
                    wpcd_data_coupon_page_url: wpcd_data_coupon_page_url,
                    wpcd_data_category_coupons: wpcd_data_category_coupons,
                    wpcd_data_vendor_coupons: wpcd_data_vendor_coupons,
                    wpcd_data_ven_cat_id: wpcd_data_ven_cat_id,
                    wpcd_page_num: wpcd_page_num,
                    search_text: search_text
                },
                success: function (response) {
                    if (response) {
                        var coupon_container = $('.wpcd_coupon_archive_container');
                        if (coupon_container.length > 0) {
                            let count_down_span;
                            let masterTooltip;
                            let mLDElements;
                            if (!infinite_scroll) {
                                coupon_container.html(response);

                                $('#wpcd_coupon_pagination_wr a.page-numbers').off('click');
                                $('#wpcd_coupon_pagination_wr a.page-numbers').on('click', function (e) {
                                    e.preventDefault();
                                    var href = $(this).attr('href');
                                    var href_arr = wpcd_getUrlVar(href);
                                    var wpcd_page_num = href_arr['wpcd_page_num'];
                                    var search_text = href_arr['search_text'];
                                    var this_parrent = $(this).parent('#wpcd_coupon_pagination_wr');
                                    var action = this_parrent.attr('wpcd-data-action');
                                    wpcd_ajaxCouponCategoriesPagination(wpcd_page_num, action, wpcd_js_data_tax, wpcd_coupon_taxonomy, search_text);
                                });

                                masterTooltip = $('.masterTooltip');
                            } else {
                                $('#wpcd_coupon_pagination_wr').remove();
                                coupon_container.append('<div class="boundaryBetweenOldAndNewItems" style="height: 1px"></div>');
                                let boundaryBetweenOldAndNewItems = $('.boundaryBetweenOldAndNewItems');
                                coupon_container.append(response);
                                wpcdCouponLoader.classList.remove('wpcd_coupon_loader_infinite_scroll');
                                window.addEventListener('scroll', infiniteScroll);


                                let newItems = boundaryBetweenOldAndNewItems.nextAll('.wpcd_item');
                                count_down_span = boundaryBetweenOldAndNewItems.nextAll('.wpcd_item').find('[data-countdown_coupon]');
                                masterTooltip = boundaryBetweenOldAndNewItems.nextAll('.wpcd_item').find('.masterTooltip');

                                mLDElements = {};
                                mLDElements.fullDescription = boundaryBetweenOldAndNewItems.nextAll('.wpcd_item').find('.wpcd-full-description');
                                mLDElements.more = boundaryBetweenOldAndNewItems.nextAll('.wpcd_item').find('.wpcd-more-description');
                                mLDElements.less = boundaryBetweenOldAndNewItems.nextAll('.wpcd_item').find('.wpcd-less-description');

                                boundaryBetweenOldAndNewItems.remove();
                            }

                            wpcdCouponLoader.classList.add('wpcd_coupon_hidden_loader');

                            wpcd_countDownFun(count_down_span);

                            masterTooltip.hover(function () {
                                var title = $(this).attr('title');
                                $(this).data('tipText', title).removeAttr('title');
                                $('<p class="wpcd-copy-tooltip"></p>')
                                    .text(title)
                                    .appendTo('body')
                                    .fadeIn('slow');
                            }, function () {
                                $(this).attr('title', $(this).data('tipText'));
                                $('.wpcd-copy-tooltip').remove();
                            }).mousemove(function (e) {
                                var mousex = e.pageX + 20;
                                var mousey = e.pageY + 10;
                                $('.wpcd-copy-tooltip')
                                    .css({top: mousey, left: mousex})
                            });

                            if(!wpcd_coupon_taxonomy) wpcd_coupon_taxonomy = 'all';
                            $.each($('#wpcd_cat_ul  li'), function () {
                                if ($(this).children('a').attr(wpcd_js_data_tax) == wpcd_coupon_taxonomy) {
                                    $(this).children('a').addClass('active');
                                } else {
                                    $(this).children('a').removeClass('active');
                                }
                            });

                            wpcd_moreLessDescription(mLDElements);
                        }
                    } else {
                        //wpcdCouponLoader.classList.add('wpcd_coupon_hidden_loader');
                    }
                }
            });
        }, 500);

    };

    // function for generation event
    function wpcdDocumentEventGenerate(eventName, element, details) {
        if (eventName && element) {
            if (!details) {
                details = true;
            }
            let event = new CustomEvent(eventName, {detail: details, bubbles: true});
            element.dispatchEvent(event);
        }
    }

    let wpcdCatUl = document.querySelector('#wpcd_cat_ul');
    if (wpcdCatUl) {
        //let wpcdDropdownContent = wpcdCatUl.querySelector( '.wpcd_dropdown-content' );
        let wpcdDropbtn = wpcdCatUl.querySelector('.wpcd_dropbtn');
        // if( wpcdDropdownContent ) {
        //     wpcdCatUl.addEventListener( 'mouseenter', function() {
        //         wpcdDropdownContent.style.display = 'block';
        //     }, false );
        //
        //     wpcdCatUl.addEventListener( 'mouseleave', function() {
        //         wpcdDropdownContent.style.display = 'none';
        //     }, false );
        //
        //     if( wpcdDropbtn && wpcdDropbtn.style.display !== 'none' ) {
        //         wpcdDropbtn.addEventListener( 'click', function () {
        //             wpcdDropdownContent.style.display = 'block';
        //         }, false );
        //     }
        // }

        /**
         * sets the element's style "display" to block
         *
         * @param {HTMLElement} wpcdDropdownContent
         */
        function dropDownContDisplayBlock() {
            $(".wpcd_categories_in_dropdown > div").css('display', 'block');
        }

        /**
         * sets the element's style "display" to none
         *
         * @param {HTMLElement} wpcdDropdownContent
         */
        function dropDownContDisplayNone() {
            $(".wpcd_categories_in_dropdown > div").css('display', 'none');
        }

        /**
         * add events handlers for drop down menu
         */
        function dropDownMenuHandlersAdd() {
            wpcdCatUl.addEventListener('mouseenter', dropDownContDisplayBlock, false);

            wpcdCatUl.addEventListener('mouseleave', dropDownContDisplayNone, false);

            wpcdDropbtn.addEventListener('click', dropDownContDisplayBlock, false);
        }

        /**
         * remove events handlers for drop down menu
         */
        function dropDownMenuHandlersRemove() {
            wpcdCatUl.removeEventListener('mouseenter', dropDownContDisplayBlock, false);

            wpcdCatUl.removeEventListener('mouseleave', dropDownContDisplayNone, false);

            wpcdDropbtn.removeEventListener('click', dropDownContDisplayBlock, false);
        }

        $('#wpcd_cat_ul .wpcd_category').on('click', function (e) {
            e.preventDefault();

            wpcdDocumentEventGenerate('mouseleave', wpcdCatUl);

            var wpcd_coupon_taxonomy = $(this).attr(wpcd_js_data_tax);

            wpcd_ajaxCouponCategoriesPagination('', 'wpcd_coupons_category_action', wpcd_js_data_tax, wpcd_coupon_taxonomy);
        });

        function wpcd_categoriesDropdown() {
            var sw = jQuery(".wpcd_div_nav_block").width();
            if (sw < 850) {
                $(".wpcd_categories_in_dropdown > div").addClass('wpcd_dropdown-content');
                $(".wpcd_categories_in_dropdown > a").css('display', 'inline');
                //jQuery(".wpcd_categories_full").css('display', 'none');
                dropDownMenuHandlersAdd();
            } else {
                $(".wpcd_categories_in_dropdown > div").removeClass('wpcd_dropdown-content');
                $(".wpcd_categories_in_dropdown > a").css('display', 'none');
                dropDownMenuHandlersRemove();
            }
        }

        wpcd_categoriesDropdown();
    }

    $('#wpcd_coupon_pagination_wr a.page-numbers').on('click', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        var href_arr = wpcd_getUrlVar(href);
        var wpcd_page_num = href_arr['wpcd_page_num'];
        var wpcd_coupon_taxonomy = href_arr['wpcd_category'];
        if (!wpcd_coupon_taxonomy) {
            wpcd_coupon_taxonomy = href_arr['wpcd_vendor'];
        }
        var search_text = href_arr['search_text'];
        var this_parrent = $(this).parent('#wpcd_coupon_pagination_wr');
        var action = this_parrent.attr('wpcd-data-action');
        wpcd_ajaxCouponCategoriesPagination(wpcd_page_num, action, wpcd_js_data_tax, wpcd_coupon_taxonomy, search_text);
    });

    let delayTimer;
    $('.wpcd_searchbar_search input').on('input', function (e) {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(() => {
            let search_string = $(this).val();

            // $('.wpcd_item').each(function () {
            //     let name = $(this).attr('wpcd-data-search').toLowerCase();
            //     let n = name.indexOf(search_string.toLowerCase());
            //     if (n != -1) {
            //         $(this).fadeIn();
            //     } else {
            //         $(this).hide();
            //     }
            // })
            wpcd_ajaxCouponCategoriesPagination('1', 'wpcd_coupons_category_action', wpcd_js_data_tax, 'all', search_string);
        }, 800);
    })

    function wpcd_getUrlVar(urlVar) {
        var urlVar = urlVar;
        var arrayVar = [];
        var valueAndKey = [];
        var resultArray = [];
        arrayVar = (urlVar.substr(1)).split('&');
        if (arrayVar[0] == "") return false;
        for (i = 0; i < arrayVar.length; i++) {
            valueAndKey = arrayVar[i].split('=');
            resultArray[valueAndKey[0]] = valueAndKey[1];
        }
        return resultArray;
    }

    /*
    $('.wpcd_search2 .wpcd_searchbar_search input').hide();
    $('.wpcd_search2 #wpcd_searchbar_search_close').hide();
    $('#wpcd_searchbar_search_icon').on('click', function (e) {
        $('.wpcd_search2 .wpcd_searchbar_search input').fadeIn();
        $('.wpcd_search2 #wpcd_searchbar_search_close').fadeIn();
    });
    $('.wpcd_search2 #wpcd_searchbar_search_close').on('click', function (e) {
        $('.wpcd_search2 .wpcd_searchbar_search input').fadeOut();
        $('.wpcd_search2 #wpcd_searchbar_search_close').fadeOut();
        $('.wpcd_item').fadeIn();
        $('.wpcd_searchbar_search input').val('');
    });*/

    // $('#wpcd_searchbar_search_icon').on('click', function (e) {
    //     $('.wpcd_searchbar_search input').fadeIn();
    //     $('#wpcd_searchbar_search_close').fadeIn();
    // });
    // $('#wpcd_searchbar_search_close').on('click', function (e) {
    //     $('.wpcd_searchbar_search input').fadeOut();
    //     $('#wpcd_searchbar_search_close').fadeOut();
    //     $('.wpcd_item').fadeIn();
    //     $('.wpcd_searchbar_search input').val('');
    // });

    function wpcd_countDownFun(count_down_span) {
        if(!count_down_span) {
            count_down_span = $('[data-countdown_coupon]');
        }

        count_down_span.each(function () {
            var $this = $(this), finalDate = $(this).data('countdown_coupon');
            $this.countdown(finalDate, function (event) {
                var format = '%M ' + wpcd_main_js.minutes + ' %S ' + wpcd_main_js.seconds;
                if (event.offset.hours > 0) {
                    format = '%H ' + wpcd_main_js.hours + ' %M ' + wpcd_main_js.minutes + ' %S ' + wpcd_main_js.seconds;
                }
                if (event.offset.totalDays > 0) {
                    format = '%-d ' + wpcd_main_js.day + '%!d ' + format;
                }
                if (event.offset.weeks > 0) {
                    format = '%-w ' + wpcd_main_js.week + '%!w ' + format;
                }
                if (event.offset.weeks == 0 && event.offset.totalDays == 0 && event.offset.hours == 0 && event.offset.minutes == 0 && event.offset.seconds == 0) {
                    jQuery(this).parent().addClass('wpcd-countdown-expired').html(wpcd_main_js.expired_text);
                } else {
                    jQuery(this).html(event.strftime(format));
                }
            }).on('finish.countdown', function (event) {
                jQuery('.wpcd-coupon-two-countdown-text').hide();
                jQuery(this).html(wpcd_main_js.expired_text).parent().addClass('disabled');
            });
        });
    }

    wpcd_countDownFun();

    function wpcd_couponCountingFun() {
        $('.wpcd-coupon-click-link').click(function (e) {
            var $this = $(this),
                coupon_id = $this.data('id');

            var data = {
                'action': 'wpcd_coupon_clicked_action',
                'security': wpcd_object.security,
                'coupon_id': coupon_id,
            };
            jQuery.post(wpcd_object.ajaxurl, data, function (response) {
                console.log('response', response)
            });
        });
    }

    wpcd_couponCountingFun();
});

jQuery(document).ready(function ($) {

    // For social share
    $('.fb-share,.tw-share,.go-share').click(function (e) {
        e.preventDefault();
        window.open($(this).attr('href'), 'fbShareWindow', 'height=450, width=550, top='
            + ($(window).height() / 2 - 275) + ', left=' + ($(window).width() / 2 - 225)
            + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
        return false;
    });

    /*
     * Vote System
     */
    $('a[class^=wpcd-vote]').click(function (e) {
        e.preventDefault();
        var $this = $(this),
            coupon_id = $this.data('id'),
            meta = "up",
            el_sibling_percentage = $this.siblings(".wpcd-vote-percent"),
            el_percentage = $('.wpcd-vote-percent[data-id=' + coupon_id + ']');

        if ($this.hasClass("wpcd-vote-down")) {
            meta = "down";
        }
        var data = {
            'action': 'wpcd_vote',
            'security': wpcd_object.security,
            'meta': meta,
            'coupon_id': coupon_id,
        };

        jQuery.post(wpcd_object.ajaxurl, data, function (response) {
            if (response === "Failed") {
                wpcd_displayMsg(wpcd_main_js.vote_failed, el_percentage, 2000);
            } else if (response === "voted") {
                wpcd_displayMsg(wpcd_main_js.vote_already, el_sibling_percentage, 2000);
            } else {
                wpcd_displayMsg(wpcd_main_js.vote_success, el_percentage, 2000);
                setTimeout(function () {
                    wpcd_displayMsg(response, el_percentage, 0);
                }, 2000);

            }
        });

        /*
         * This function dispaly msg in a specific element for a little time
         *
         * @param string 'Msg' is the message that will be displayed in the element
         * @param object 'el' is the element
         * @param int 'Time' is the time in milliSecond or 0 if this will be the text for ever
         */
        function wpcd_displayMsg(Msg, el, Time = 0) {

            if (typeof (el) === "object") {
                if (Time === 0) {
                    el.html(Msg);
                } else {
                    var old_text = el.html();
                    el.html(Msg);
                    setTimeout(function () {
                        el.html(old_text);
                    }, Time);
                }
            }
        }
    });
});

jQuery(document).ready(function ($) {
    $(document).ready(function () {
        $('.masterTooltip').hover(function () {
            var title = $(this).attr('title');
            $(this).data('tipText', title).removeAttr('title');
            $('<p class="wpcd-copy-tooltip"></p>')
                .text(title)
                .appendTo('body')
                .fadeIn('slow');
        }, function () {
            $(this).attr('title', $(this).data('tipText'));
            $('.wpcd-copy-tooltip').remove();
        }).mousemove(function (e) {
            var mousex = e.pageX + 20;
            var mousey = e.pageY + 10;
            $('.wpcd-copy-tooltip')
                .css({top: mousey, left: mousex})
        });
    });

    

    

});

jQuery(document).ready(function ($) {

    $(window).resize(wpcd_updateCouponClassRan);

    function wpcd_updateCouponClassRan() {
        wpcd_updateCouponClass('.wpcd-coupon-default', 'wpcd-template-default-mobile', 'wpcd-mobile-mini', 510, 380);
        wpcd_updateCouponClass('.wpcd-coupon-one', 'wpcd-template-one-mobile', 'wpcd-mobile-mini', 530, 380);
        wpcd_updateCouponClass('.wpcd-coupon-two', 'wpcd-template-two-mobile', 'wpcd-mobile-mini', 530, 380);
        wpcd_updateCouponClass('.wpcd-coupon-three', 'wpcd-template-three-mobile', 'wpcd-mobile-mini', 400, 380);
        wpcd_updateCouponClass('.wpcd-coupon-four', 'wpcd-template-four-mobile', 'wpcd-mobile-mini', 530, 380);
        wpcd_updateCouponClass('.wpcd-template-five', 'wpcd-template-five-mobile', 'wpcd-mobile-mini', 510, 380);
        wpcd_updateCouponClass('.wpcd-coupon-six', 'wpcd-template-six-mobile', 'wpcd-mobile-mini', 530, 380);
        wpcd_updateCouponClass('.wpcd_seven_couponBox', 'wpcd-template-seven-mobile', 'wpcd-mobile-mini', 540, 380);
        wpcd_updateCouponClass('.wpcd-new-grid-container', 'wpcd-template-eight-mobile', 'wpcd-mobile-mini', 500, 380);
    }

    function wpcd_updateCouponClass(class_box, class1, class2, width1, width2) {
        $.each($(class_box), function () {
            if ($(this).width() > width1) {
                $(this).removeClass(class1);
            } else {
                $(this).addClass(class1);
            }
            if ($(this).width() > width2) {
                $(this).removeClass(class2);
            } else {
                $(this).addClass(class2);
            }
        });
    }

    wpcd_updateCouponClassRan();
});



function wpcd_copyToClipboard(element) {
    var $temp = jQuery("<input>");
    jQuery("body").append($temp);
    $temp.val(jQuery(jQuery(element)[0]).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

function wpcd_openCouponAffLink(objectThis, CoupenId, wpcd_dataTaxonomy, numCoupon) {
    var a = jQuery(objectThis);
    var oldLink = a.attr('href');

    var wpcd_couponTaxonomy;
    var wpcdPageNum;

    var oldLinkArrPrepare = oldLink.replace("?", "");
    var oldLinkArr = oldLinkArrPrepare.split('&');
    for (var i = 0; i < oldLinkArr.length; i++) {
        if (oldLinkArr[i].indexOf(wpcd_dataTaxonomy + '=') > -1) {
            wpcd_couponTaxonomy = oldLinkArr[i].split('=')[1];
        }
        if (oldLinkArr[i].indexOf('wpcd_page_num=') > -1) {
            wpcdPageNum = oldLinkArr[i].split('=')[1];
        }
    }

    if (window.location.href.indexOf('wpcd_coupon') > -1) { // check if there's wpcd_coupon in the url
        var wpcd_id = jQuery.wpcd_urlParam('wpcd_coupon');
        oldLink = window.location.href.replace("wpcd_coupon=" + wpcd_id, "wpcd_coupon=" + CoupenId);

        if (window.location.href.indexOf('wpcd_num_coupon') > -1) {
            var num_coupon = jQuery.wpcd_urlParam('wpcd_num_coupon');
            if (numCoupon) {
                oldLink = oldLink.replace("wpcd_num_coupon=" + num_coupon, "wpcd_num_coupon=" + numCoupon);
            } else {
                oldLink = oldLink.replace("&wpcd_num_coupon=" + num_coupon, "");
            }

        } else if (numCoupon) {
            oldLink = oldLink + "&wpcd_num_coupon=" + numCoupon;
        }

        if (window.location.href.indexOf(wpcd_dataTaxonomy) > -1) {
            var wpcd_coupon_taxonomy = jQuery.wpcd_urlParam(wpcd_dataTaxonomy);
            if (wpcd_couponTaxonomy) {
                oldLink = oldLink.replace(wpcd_dataTaxonomy + "=" + wpcd_coupon_taxonomy, wpcd_dataTaxonomy + "=" + wpcd_couponTaxonomy);
            } else {
                oldLink = oldLink.replace("&" + wpcd_dataTaxonomy + "=" + wpcd_coupon_taxonomy, "");
            }

        } else if (wpcd_couponTaxonomy) {
            oldLink = oldLink + "&" + wpcd_dataTaxonomy + "=" + wpcd_couponTaxonomy;
        }

        if (window.location.href.indexOf('wpcd_page_num') > -1) {
            var wpcd_page_num = jQuery.wpcd_urlParam('wpcd_page_num');
            if (wpcdPageNum) {
                oldLink = oldLink.replace("wpcd_page_num=" + wpcd_page_num, "wpcd_page_num=" + wpcdPageNum);
            } else {
                oldLink = oldLink.replace("&wpcd_page_num=" + wpcd_page_num, "");
            }

        } else if (wpcdPageNum) {
            oldLink = oldLink + "&wpcd_page_num=" + wpcdPageNum;
        }

    } else if (window.location.href.indexOf('?') > -1 && window.location.href.indexOf('?wpcd_coupon') === -1) {// check if there's paramater in the url
        oldLink = window.location.href + oldLink.replace("?", "&");
    }
    a.attr('href', oldLink);
    //the affiliate link
    var theLink = a.attr("data-aff-url");
    window.open(a.attr('href'), '_blank');
    window.location = theLink;
    return false;
}



