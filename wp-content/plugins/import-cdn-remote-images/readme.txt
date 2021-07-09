=== Import CDN-Remote Images ===
Contributors: atakanau
Author link: https://atakanau.blogspot.com
Tags: cdn image, remote media, remote URL, remote image, remote file, external media, Cloudinary
Requires at least: 4.7.4
Tested up to: 5.7.2
Stable tag: 2.00
Requires PHP: 5.6
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0-standalone.html

Add external images to the media library without importing, i.e. uploading them to your WordPress site.

== Description ==

By default, adding an image to the WordPress media library requires you to import or upload the image to the WordPress site, which means there must be a copy of the image file stored in the site. This plugin enables you to add an image stored in an external site to the media library by just reading list of remote images using CDN service's (Cloudinary) API. In this way you can host the images in a dedicated server other than the WordPress site, and still be able to show them by various gallery plugins which only take images from the media library.

The plugin provides a dedicated 'Media' -> 'Import images' submenu page.

Supported CDN services:
* Cloudinary
(others coming soon)

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/import-cdn-remote-images` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.

= Usage =

After installation you can use the plugin to add external media without import:

1. Go to setting page of plugin and save required CDN service parameters such as Cloud name, API key, API secret.
2. Click the 'Media' -> 'Import images' submenu in the side bar.
3. Click 'Update' button and automatically fill in the URLs of the images you want to add.
4. Click the 'Add' button, the remote images will be added.

== Screenshots ==
1. Settings Page - Cloudinary
2. Import Page - Bulk URL
3. Import Page - Cloudinary
4. Sample imported image 1
5. Sample imported image 2

== Changelog ==

= Version 2.00 =
* Added: Bulk custom URL import
* Improved: User interface
* Fixed: Not showing submenu link for WooCommerce Shop Manager users

= Version 1.0.0 =
* Initial version released

