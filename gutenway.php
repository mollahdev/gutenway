<?php
/*
Plugin Name: Gutenway - A Gutenberg Blocks Plugin for WordPress
Plugin URI: #
Description: A plugins for WordPress site. It helps to build templates demo, integration pages and regular pages with Gutenberg. With highly optimized assets
Author: Gutenway
Version: 1.0.0
Author URI: https://github.com/Gutenway
*/

namespace Gutenway;
use Gutenway\App\Scripts;
use Gutenway\Blocks\RegisterBlocks;

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

    public static function site_url( $slug = '' ) {
        return get_site_url() . '/' . $slug;
    }

    public static function admin_url( $route = '' ) {
        return esc_url( admin_url( 'admin.php?page=' . 'gutenway' ) . $route );
    }

    public static function require( $file_or_dir = '', $path_only = false ) 
    {
        if( !$path_only ) {
            require trailingslashit( plugin_dir_path( __FILE__ ) ) . $file_or_dir;
        } else {
            return trailingslashit( plugin_dir_path( __FILE__ ) ) . $file_or_dir;
        }
    }

    public static function part( $file = '', $args = []) {
        $file_path = self::require( $file . '.php', true );
        if( file_exists( $file_path ) ) {
            include( $file_path );
        }
    }

    public static function include_once( $file = '', $no_return = false ) {
        if( !$no_return ) {
            return include_once( self::require( $file, true ) );
        } else {
            include_once( self::require( $file, true ) );
        }
    }

    private function boot() {
        
        add_theme_support( 'editor-styles' );
		add_theme_support( 'wp-block-styles' );
        add_theme_support( 'align-wide' );
        
        new Scripts();
        new RegisterBlocks();
    }

    private function initAutoLoader() 
    {
        $this::require('autoloader.php');
        $loader = new AutoLoader();
        $loader->register();
        $loader->addNamespace( 'Gutenway\Blocks', $this::require('blocks', true) );     
        $loader->addNamespace( 'Gutenway\App', $this::require('app', true) );
    }
}

new Gutenway();