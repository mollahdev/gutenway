<?php
namespace Gutenway\Blocks;

use Gutenway;
use Gutenway\App\ScriptBase;
use Gutenway\App\Singleton;

class RegisterBlocks extends ScriptBase {
    use Singleton;

	const block_list = [
		'gutenway/container'
	];

    protected function __construct()
    {
        add_action( 'init', [$this, 'register_blocks'] );
		add_action( 'enqueue_block_editor_assets', [$this, 'load_editor_assets'] );
		add_action( 'save_post', array( $this, 'save_block_css' ), 10, 3 );

		if ( !is_admin() && !wp_is_json_request() ) {
			add_filter( 'wp_footer', array( $this, 'load_block_css' ), 10, 2 );
		}
    }
	public function load_editor_assets() {
		$this->enqueue_script( 'blocks' );
	}

	/**
	 * Register block
	 */ 
    public function register_blocks()
    {

		foreach ( $this::block_list as $block ) {
			$block_name = self::extract_block_name( $block );
			$block_dir	= Gutenway::path('blocks/' . $block_name);
			$block_json_file = Gutenway::path('blocks/' . $block_name . '/block.json' );

			if ( ! file_exists( $block_json_file ) ) {
				continue;
			}

			register_block_type( $block_dir );
		}
    }

	public static function extract_block_name( $block ) {
		$parts = explode( '/', $block );
		return end( $parts );
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
			wp_register_style( 'gutenway-frontend', false );
			wp_enqueue_style( 'gutenway-frontend' );
			wp_add_inline_style( 'gutenway-frontend', $css );

			global $wp_styles;
			if ( isset( $wp_styles->registered['gutenway-frontend'] ) ) {
				$wp_styles->registered['gutenway-frontend']->extra['group'] = 1; // 0 = head, 1 = footer
			}
		}
	}
}