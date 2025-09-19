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
		// 'column',
		// 'proposal-template',
		// 'template-banner',
	];

	public $config = [];

    public function __construct()
    {
        add_action( 'init', [$this, 'register_blocks'] );
    }

	/**
	 * Dynamic block wrapper markup 
	 */ 
	public function block_dynamic_render( $attr ) 
	{

		$adv_id			= isset($attr['adv_id']) ? $attr['adv_id'] : '';
		$adv_classes	= isset($attr['adv_classes']) ? $attr['adv_classes'] : '';
		$client_name	= isset($attr['clientName']) ? $attr['clientName'] : '';
		$client_id		= isset($attr['clientId']) ? $attr['clientId'] : '';

		ob_start(); ?>
			<div 
				id="<?php echo esc_attr($adv_id) ?>"
				data-type="<?php echo esc_attr($client_name) ?>" 
				class="gutenway-block-wrapper element-<?php echo esc_attr($client_id) ?> <?php echo esc_attr($adv_classes) ?>"
			>
				<?php include($this->config['block_screen_file'])?>
			</div>
		<?php return ob_get_clean();
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

			/**
			 * assign block scripts handler 
			 */ 
			$register_options = array(
				'editor_script' => 'gutenway-block-editor', // Editor scripts.
				'editor_style'  => 'gutenway-block-editor', // Editor styles.
			);
			
			/**
			 * add dynamic block attributes
			 */ 
			if( isset($metadata['serverRender']) && $metadata['serverRender'] ) {
				$this->config['block_screen_file'] 		= $metadata['block_screen_file'];
				$register_options['render_callback'] 	= [$this, 'block_dynamic_render'];
			}

			register_block_type_from_metadata( $metadata['block_json_file'], $register_options );
		}
    }

    public function get_metadata_by_folders( $block_folders ) 
    {
		
        $blocks = array();
		$blocks_dir = Gutenway::require('blocks', true);
		
        if ( ! file_exists( $blocks_dir ) ) {
			return $blocks;
		}

		foreach ( $block_folders as $folder_name ) {
			$block_json_file	= $blocks_dir . '/' . $folder_name . '/block.json';
			$block_screen_file	= $blocks_dir . '/' . $folder_name . '/screen.php';
			if ( ! file_exists( $block_json_file ) ) {
				continue;
			}

			$metadata = json_decode( file_get_contents( $block_json_file ), true );
			array_push( $blocks, array_merge( $metadata, array( 
				'block_json_file'	=> $block_json_file,
				'block_screen_file' => $block_screen_file
			) ) );
		}

		return $blocks;
	}
}