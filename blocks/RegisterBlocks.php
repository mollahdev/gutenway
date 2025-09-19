<?php
namespace Gutenway\Blocks;

use Gutenway\App\Singleton;
use Gutenway\Gutenway;

class RegisterBlocks {
    use Singleton;
	
	/**
	 * Register block 
	 */ 
	const block_list = [
		'gutenway/container'
	];

	public $config = [];

    public function __construct()
    {
        add_action( 'init', [$this, 'register_blocks'] );;
		if ( !is_admin() && !wp_is_json_request() ) {
			add_filter( 'the_content', array( $this, 'load_block_css' ), 10, 2 );
		}
    }

	/**
	 * Register block
	 */ 
    public function register_blocks()
    {

        $block_list_metadata = $this->get_metadata_by_folders( $this::block_list );
		foreach ( $block_list_metadata as $metadata ) {
			$registry = \WP_Block_Type_Registry::get_instance();
			if ( $registry->is_registered( $metadata['name'] ) ) {
				$registry->unregister( $metadata['name'] );
			}

			register_block_type_from_metadata( $metadata['block_json_file'], array() );
		}
    }

	private function extract_block_name( $block ) {
		$parts = explode( '/', $block );
		return end( $parts );
	}

    public function get_metadata_by_folders( $block_folders ) 
    {
		
        $blocks = array();
		$blocks_dir = Gutenway::require('blocks', true);
		
        if ( ! file_exists( $blocks_dir ) ) {
			return $blocks;
		}

		foreach ( $block_folders as $folder_name ) {
			$folder_name		= $this->extract_block_name( $folder_name );
			$block_json_file	= $blocks_dir . '/' . $folder_name . '/block.json';

			if ( ! file_exists( $block_json_file ) ) {
				continue;
			}

			$metadata = json_decode( file_get_contents( $block_json_file ), true );
			array_push( $blocks, array_merge( $metadata, array( 
				'block_json_file'	=> $block_json_file
			) ) );
		}

		return $blocks;
	}

	public static function parse_blocks( $blocks, &$allBlocks ) {
		foreach ( $blocks as $block ) {
			if ( isset( $block['blockName'] ) && strpos( $block['blockName'], 'gutenway/' ) !== false ) {
				array_push( $allBlocks, $block );
			}

			self::parse_blocks( $block['innerBlocks'], $allBlocks );
		}
	}

	public function load_block_css( $content ) {
		$blocks = parse_blocks( get_the_content() );
		$allBlocks = array();
		self::parse_blocks( $blocks, $allBlocks );

		$stylesheet = '';
		foreach ( $allBlocks as $block ) {
			$css = isset( $block['attrs']['css'] ) ? $block['attrs']['css'] : '';
			$stylesheet .= $css;
		}

		if ( ! empty( $stylesheet ) ) {
			$style_tag = '<style id="gutenway-block-styles">' . $stylesheet . '</style>';
			add_action( 'wp_footer', function() use ( $style_tag ) {
				echo $style_tag;
			} );
		}
		return $content;
	}
}