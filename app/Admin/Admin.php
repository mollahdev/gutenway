<?php 
namespace Gutenway\App\Admin;
use Gutenway\App\Singleton;

class Admin {
    use Singleton;

    public function __construct() {
        new RegisterMenu();
        new Script();
    }
}