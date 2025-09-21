<?php
/*
Plugin Name: Gutenway Blocks
Plugin URI: #
Description: A plugins for WordPress site. It helps to build templates demo, integration pages and regular pages with Gutenberg. With highly optimized assets
Author: Gutenway
Version: 1.0.0
Author URI: https://github.com/Gutenway
*/
class Gutenway {

    public function __construct()
    {
        $this->initAutoLoader();
        $this->boot();
    }

    public static function version() {
        return '1.0.0';
    }

    public static function url( $file = '' )
    {
        return trailingslashit( plugins_url( '/', __FILE__ ) ) . $file;
    }

    public static function admin_url( $route = '' ) {
        return esc_url( admin_url( 'admin.php?page=' . 'gutenway' ) . $route );
    }

    public static function path( $file = '' ) 
    {
        return trailingslashit( plugin_dir_path( __FILE__ ) ) . $file;
    }

    public static function require( $file_or_dir = '' ) 
    {
        require self::path( $file_or_dir );
    }

    public static function include_once( $file_or_dir = '' ) 
    {
        return include_once self::path( $file_or_dir );
    }

    private function boot() {
        add_theme_support( 'editor-styles' );
		add_theme_support( 'wp-block-styles' );
        add_theme_support( 'align-wide' );
        add_theme_support( 'responsive-embeds' );

        \Gutenway\Blocks\RegisterBlocks::getInstance();
        \Gutenway\App\Admin\Admin::getInstance();
        \Gutenway\Modules\HeaderFooter\HeaderFooter::getInstance();
    }

    private function initAutoLoader() 
    {
        $this::require('autoloader.php');
        $loader = new AutoLoader();
        $loader->register();
        $loader->addNamespace( 'Gutenway\App', $this::path('app') );
        $loader->addNamespace( 'Gutenway\Admin', $this::path('app/Admin') );
        $loader->addNamespace( 'Gutenway\Blocks', $this::path('blocks') );
        $loader->addNamespace( 'Gutenway\Modules\HeaderFooter', $this::path('modules/HeaderFooter') );
    }
}

new Gutenway();