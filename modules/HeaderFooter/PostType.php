<?php
namespace Gutenway\Modules\HeaderFooter;

class PostType {
    public function __construct()
    {
        add_action('init', [$this, 'register_header_footer']);
        add_action('restrict_manage_posts', [$this, 'render_type_filter']);
        add_filter('parse_query', [$this, 'parse_filter_query']);
    }

    public function register_header_footer() {
        $labels = [
            'name' => 'Header & Footer',
            'singular_name' => 'Header & Footer',
            'menu_name' => 'Header & Footer',
            'name_admin_bar' => 'Header & Footer',
            'add_new' => 'Add New',
            'add_new_item' => 'Add New Header & Footer',
            'new_item' => 'New Header & Footer',
            'edit_item' => 'Edit Header & Footer',
            'view_item' => 'View Header & Footer',
            'all_items' => 'All Header & Footer',
            'search_items' => 'Search Header & Footer',
            'parent_item_colon' => 'Parent Header & Footer:',
            'not_found' => 'No Header & Footer found.',
            'not_found_in_trash' => 'No Header & Footer found in Trash.'
        ];

        $args = [
            'labels' => $labels,
            'supports' => ['editor'],
            'public' => true,
            'show_in_menu' => false,
            'has_archive' => true,
            'query_var' => true,
            'show_in_rest' => true,
            'show_in_nav_menus'  => false,
        ];

        register_post_type('gtway_header_footer', $args);
    }

    public function render_type_filter( $post_type ) {
        if ( $post_type === 'gtway_header_footer' ) {
            $selected = isset($_GET['gtway_header_footer']) ? $_GET['gtway_header_footer'] : '';
            ?>
            <select name="gtway_header_footer">
                <option value="">All Types</option>
                <option value="header" <?php selected( $selected, 'header' ); ?>>Header</option>
                <option value="footer" <?php selected( $selected, 'footer' ); ?>>Footer</option>
            </select>
            <?php
        }
    }

    public function parse_filter_query( $query ) {
        global $pagenow;
        if ( $pagenow === 'edit.php'
            && isset($_GET['post_type'])
            && $_GET['post_type'] === 'gtway_header_footer'
            && !empty($_GET['gtway_header_footer']) ) {

            $query->query_vars['meta_key']   = '_gutenway_type';
            $query->query_vars['meta_value'] = sanitize_text_field($_GET['gtway_header_footer']);
        }
    }
}