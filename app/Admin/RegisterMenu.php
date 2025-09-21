<?php 
namespace Gutenway\App\Admin;

class RegisterMenu {
    public function __construct() {
        add_action('admin_menu', [$this, 'addAdminMenu']);
    }

    public static $page_slug = 'gutenway';

    public function addAdminMenu() {
        add_menu_page(
            'Gutenway Settings',
            'Gutenway',
            'manage_options',
            self::$page_slug,
            [$this, 'render_admin_menu'],
            'dashicons-admin-generic',
            20
        );

        add_submenu_page(
            self::$page_slug,
            'Overview',
            'Overview',
            'manage_options',
            self::$page_slug,
            [$this, 'render_admin_menu']
        );
    }

    public function render_admin_menu() {
        echo '<div><h1>Gutenway Overview</h1><p>Welcome to the Gutenway plugin overview page.</p></div>';
    }
}