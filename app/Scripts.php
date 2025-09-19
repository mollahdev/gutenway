<?php
namespace Gutenway\App;
use Gutenway\Gutenway;

class Scripts {
    use Singleton;

    public function __construct()
    {
        add_action( 'admin_enqueue_scripts', [$this, 'load_admin_scripts'] );
    }

    /**
     * backend/admin common js and css
     */ 
    public function load_admin_scripts()
    {

        wp_enqueue_media();

        // Backend editor scripts
        $dependencies = Gutenway::include_once('build/blocks.asset.php');

        wp_register_script( 
            'gutenway-block-editor', 
            Gutenway::url('build/blocks.js'), 
            $dependencies['dependencies'], 
            $dependencies['version'], 
            true 
        );

        // Backend editor only styles.
        wp_register_style(
            'gutenway-block-editor',
            Gutenway::url('build/blocks.css'),
            ['wp-components'],
            $dependencies['version']
        );
    }
}