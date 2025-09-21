<?php 
namespace Gutenway\App;
use Gutenway;

abstract class ScriptBase {
    private function get_asset_content( $file_name ) {
        $relative_path = 'build/'. $file_name .'.asset.php';
        $path = Gutenway::path($relative_path);

        if ( ! file_exists( $path ) ) {
            return null;
        }

        return Gutenway::include_once( $relative_path );
    }

    private function get_handler( $file_name ) {
        return 'gutenway-' . $file_name;
    }

    private function get_files_map( $file_name ) {
        return [
            'asset' => 'build/'. $file_name .'.asset.php',
            'js'     => 'build/'. $file_name .'.js',
            'css'    => 'build/'. $file_name .'.css',
        ];
    }

    protected function register_script( $file_name = '' ) {
        $files = $this->get_files_map( $file_name );
        $asset = $this->get_asset_content( $file_name );
        $handler = $this->get_handler( $file_name );

        if( !$asset ) {
            return;
        }

        if( file_exists( Gutenway::path($files['js']) ) ) {
            if( !in_array('jquery', $asset['dependencies']) ) {
                $asset['dependencies'][] = 'jquery';
            }

            wp_register_script( 
                $handler, 
                Gutenway::url($files['js']), 
                $asset['dependencies'], 
                $asset['version'], 
                true 
            );
        }

        if( file_exists( Gutenway::path($files['css']) ) ) {
            wp_register_style(
                $handler,
                Gutenway::url($files['css']),
                ['wp-components'],
                $asset['version']
            );
        }
    }

    protected function enqueue_script( $file_name = '' ) {
        $this->register_script( $file_name );
        $handler = $this->get_handler( $file_name );
        wp_enqueue_script( $handler );
        wp_enqueue_style( $handler );
    }
}