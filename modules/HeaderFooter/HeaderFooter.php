<?php 
namespace Gutenway\Modules\HeaderFooter;
use Gutenway\App\Singleton;
use Gutenway\App\Admin\RegisterMenu;

class HeaderFooter {
    use Singleton;

    public function __construct() {
        // add_action('wp_head', [$this, 'render_custom_header']);
        // add_action('wp_footer', [$this, 'render_custom_footer']);
        add_action('admin_menu', [$this, 'register_menu']);
        new PostType();
    }

    public function register_menu() {
        add_submenu_page(
            RegisterMenu::$page_slug,
            'Header & Footer Settings',
            'Header & Footer',
            'manage_options',
            'edit.php?post_type=gtway_header_footer',
            null
        );
    }

    public function render_custom_header() {
        // Custom header code can be added here
        echo '<h2>custom header</h2>';
    }

    public function render_custom_footer() {
        // Custom footer code can be added here
        echo '<h2>custom footer</h2>';
    }
}