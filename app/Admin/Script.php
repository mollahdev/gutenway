<?php 
namespace Gutenway\App\Admin;
use Gutenway\App\ScriptBase;

class Script extends ScriptBase {
    public function __construct()
    {
        add_action( 'admin_enqueue_scripts', array( $this, 'register_scripts' ) );   
    }

    public function register_scripts()
    {
        $this->enqueue_script('admin');
    }
}