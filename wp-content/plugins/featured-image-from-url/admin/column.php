<?php

add_action('admin_init', 'fifu_column');
add_filter('admin_head', 'fifu_admin_add_css_js');

function fifu_column() {
    add_filter('manage_posts_columns', 'fifu_column_head');
    add_filter('manage_pages_columns', 'fifu_column_head');
    add_filter('manage_edit-product_cat_columns', 'fifu_column_head');
    fifu_column_custom_post_type();
    add_action('manage_posts_custom_column', 'fifu_column_content', 10, 2);
    add_action('manage_pages_custom_column', 'fifu_column_content', 10, 2);
    add_action('manage_product_cat_custom_column', 'fifu_ctgr_column_content', 10, 3);
}

function fifu_admin_add_css_js() {
    wp_enqueue_style('fifu-pro-css', plugins_url('/html/css/pro.css', __FILE__), array(), fifu_version_number());
    wp_enqueue_style('fancy-box-css', 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.css');
    wp_enqueue_script('fancy-box-js', 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js');
    wp_enqueue_style('fifu-column-css', plugins_url('/html/css/column.css', __FILE__), array(), fifu_version_number());
    wp_enqueue_script('fifu-column-js', plugins_url('/html/js/column.js', __FILE__), array('jquery'), fifu_version_number());

    $fifu = fifu_get_strings_quick_edit();

    wp_localize_script('fifu-column-js', 'fifuColumnVars', [
        'labelImage' => $fifu['title']['image'](),
        'labelVideo' => $fifu['title']['video'](),
        'tipImage' => $fifu['tip']['image'](),
        'tipVideo' => $fifu['tip']['video'](),
        'urlImage' => $fifu['url']['image'](),
        'urlVideo' => $fifu['url']['video'](),
    ]);
}

function fifu_column_head($default) {
    $default['featured_image'] = '<span class="dashicons dashicons-camera" style="font-size:20px" title="Edit fast and saves in less than 1 second"></span> Quick edit';
    return $default;
}

function fifu_ctgr_column_content($internal_image, $column, $term_id) {
    if ($column == 'featured_image') {
        $border = '';
        $height = get_option('fifu_column_height');
        $width = $height * 1.5;

        $is_ctgr = true;
        $post_id = $term_id;
        $url = get_term_meta($term_id, 'fifu_image_url', true);
        if ($url == '') {
            $thumb_id = get_term_meta($term_id, 'thumbnail_id', true);
            $url = wp_get_attachment_url($thumb_id);
            $border = 'border-color: #ca4a1f !important; border: 2px; border-style: dashed;';
        }
        include 'html/column.html';
    } else
        echo $internal_image;
}

function fifu_column_content($column, $post_id) {
    if ($column == 'featured_image') {
        $border = '';
        $height = get_option('fifu_column_height');
        $width = $height * 1.5;

        $is_ctgr = false;
        $url = fifu_main_image_url($post_id);
        if ($url == '') {
            $url = wp_get_attachment_url(get_post_thumbnail_id());
            $border = 'border-color: #ca4a1f !important; border: 2px; border-style: dashed;';
        }
        include 'html/column.html';
    }
}

function fifu_column_custom_post_type() {
    foreach (fifu_get_post_types() as $post_type)
        add_filter('manage_edit-' . $post_type . '_columns', 'fifu_column_head');
}

