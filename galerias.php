<?php

/*
Plugin Name: Galerias
Plugin URI: https://wordpress.com
Description: Um plugin criado para gerenciar galerias da intranet INEMA
Version: 0.1
Author: Filipe Lopes
Author URI: https://filipelopes.me
License: CC BY-NC 3.0 BR
Text Domain: galerias
*/

// API WP
add_action( 'rest_api_init', function () {
    register_rest_route( 'galerias/v1', '/teste', array(
      'methods' => 'GET',
      'callback' => 'my_awesome_func',
    ) );
  } );

  function my_awesome_func( $data ) {
    return "teste";
  }

// Roles AND capabilities
function wporg_simple_role()
{
    add_role(
        'editor_galeria',
        'Editor de Galeria',
        [
            'read'         => true,
            'edit_posts'   => true,
            'upload_files' => true,
        ]
    );
}
add_action('init', 'wporg_simple_role', 10);

function wporg_simple_role_caps()
{
    // gets the simple_role role object
    $role = get_role('editor_galeria');
 
    // add a new capability
    $role->add_cap('ascom_galeria', true);
}
 
// add simple_role capabilities, priority must be after the initial role definition
add_action('init', 'wporg_simple_role_caps', 11);

// Ação de executar o admin_menu no core do WORDPRESS 
add_action('admin_menu', 'menu_galerias');

function menu_galerias(){
    global $wpdb;
    global $wp_roles;

    // Adiciona menu na barra lateral
    // add_menu_page( string $page_title, string $menu_title, string $capability, string $menu_slug, callable $function = '', string $icon_url = '', int $position = null )
    add_menu_page( 'Gerenciador de Galerias', 'Galerias', 'ascom_galeria' , 'galerias' , 'mostrar_galerias' , 'dashicons-format-gallery' , 20 );
    // add_submenu_page( string $parent_slug, string $page_title, string $menu_title, string $capability, string $menu_slug, callable $function = '' )
    add_submenu_page( 'galerias', 'Criar nova galeria', 'Adicionar nova', 'ascom_galeria', 'eventos-novo', 'criar_galeria' );
    
    // Cria tabela que será usada no plugin
    $sql = "CREATE TABLE IF NOT EXISTS `wp_galerias` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `imagens` json DEFAULT NULL,
        `usuario` int(11) unsigned NOT NULL,
        `datetime` datetime NOT NULL,
        PRIMARY KEY (`id`),
        KEY `usuario` (`usuario`)
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8, AUTO_INCREMENT=1";
    
    $wpdb->query($sql);
}

function mostrar_galerias(){
    include('pagina_principal.php');
}

function criar_galeria(){
    include('criar.php');
}




?>