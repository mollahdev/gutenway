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
        add_action( 'init', [$this, 'register_blocks'] );
		add_action( 'save_post', array( $this, 'save_block_css' ), 10, 3 );

		if ( !is_admin() && !wp_is_json_request() ) {
			add_filter( 'wp_footer', array( $this, 'load_block_css' ), 10, 2 );
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

	public static function extract_block_name( $block ) {
		$parts = explode( '/', $block );
		return end( $parts );
	}

    public function get_metadata_by_folders( $block_folders ) 
    {
		
        $blocks = array();
		$blocks_dir = Gutenway::path('blocks');
		
        if ( ! file_exists( $blocks_dir ) ) {
			return $blocks;
		}

		foreach ( $block_folders as $folder_name ) {
			$folder_name		= self::extract_block_name( $folder_name );
			$block_json_file	= $blocks_dir . '/' . $folder_name . '/block.json';

			if ( ! file_exists( $block_json_file ) ) {
				continue;
			}

			$metadata = json_decode( file_get_contents( $block_json_file ), true );

			array_push( $blocks, array_merge( $metadata, array( 
				'block_json_file'	=> $block_json_file,
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

	public function save_block_css( $post_id, $post, $update ) {
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}

		if ( $post->post_type === 'attachment' ||
			$post->post_type === 'revision' ||
			$post->post_type === 'nav_menu_item' ||
			$post->post_type === 'wp_template' ||
			$post->post_type === 'wp_template_part' ) { 
			return;
		}

		$blocks = parse_blocks( $post->post_content );
		$allBlocks = array();
		self::parse_blocks( $blocks, $allBlocks );

		$stylesheet = '';
		foreach ( $allBlocks as $block ) {
			$css = isset( $block['attrs']['css'] ) ? $block['attrs']['css'] : '';
			$stylesheet .= $css;
		}

		if ( ! empty( $stylesheet ) ) {
			update_post_meta( $post_id, '_gutenway_stylesheet', $stylesheet );
		} else {
			delete_post_meta( $post_id, '_gutenway_stylesheet' );
		}
	}

	public function load_block_css() {
		if ( ! is_singular() ) {
			return;
		}

		$post_id = get_queried_object_id();
		$css     = get_post_meta( $post_id, '_gutenway_stylesheet', true );

		if ( ! empty( $css ) ) {
			wp_register_style( 'gutenway-blocks', false );
			wp_enqueue_style( 'gutenway-blocks' );
			wp_add_inline_style( 'gutenway-blocks', $css );

			global $wp_styles;
			if ( isset( $wp_styles->registered['gutenway-blocks'] ) ) {
				$wp_styles->registered['gutenway-blocks']->extra['group'] = 1; // 0 = head, 1 = footer
			}
		}
	}
}