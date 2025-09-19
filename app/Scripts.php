<?php
namespace Gutenway\App;
use Gutenway\Gutenway;

class Scripts {
    use Singleton;

    public function __construct()
    {
        add_action( 'enqueue_block_editor_assets', [$this, 'load_editor_assets'] );
    }

    private function register_block_assets( $blockName = '' ) {
        $assetsFile = 'build/'. $blockName .'.asset.php';
        $jsFile = 'build/'. $blockName .'.js';
        $cssFile = 'build/'. $blockName .'.css';
        $handler = 'gutenway-' . $blockName;

        if ( ! file_exists( Gutenway::path($assetsFile) ) ) {
            return;
        }

        $dependencies = Gutenway::include_once($assetsFile);

        if( file_exists( Gutenway::path($jsFile) ) ) {
            wp_register_script( 
                $handler, 
                Gutenway::url($jsFile), 
                $dependencies['dependencies'], 
                $dependencies['version'], 
                true 
            );
        }

        if( file_exists( Gutenway::path($cssFile) ) ) {
            wp_register_style(
                $handler,
                Gutenway::url($cssFile),
                ['wp-components'],
                $dependencies['version']
            );
        }
    }

    public function load_editor_assets() {
        $this->register_block_assets( 'blocks' );
        wp_enqueue_script( 'gutenway-blocks' );
        wp_enqueue_style( 'gutenway-blocks' );
    }
}