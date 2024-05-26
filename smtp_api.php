<?php

/*
Plugin Name: SMTP API
Plugin URI: https://wordpress.com
Description: Um plugin criado para adicionar aos recursos API REST nativa do WORDPRESS a capacidade de enviar emails
Version: 0.1
Author: Filipe Lopes
Author URI: https://filipelopes.me
License: CC BY-NC 3.0 BR
Text Domain: smtp_api
*/

// API WP
include_once( plugin_dir_path( __FILE__ ) . 'rest_api.php' );

// Roles and capabilities for plugin
include_once( plugin_dir_path( __FILE__ ) . 'roles_cap.php' );

// Ação de executar o admin_menu no core do WORDPRESS 
add_action('admin_menu', 'menu_smtp_api');

function menu_smtp_api(){
    // echo "<script>alert('oi')</script>";
    global $wpdb;
    
    $menu_slug = "smtp_api";
    $capability = "smtp_config";

    // Adiciona menu no menu de configurações de aparência
    
    /* add_options_page( 
        string $page_title, 
        string $menu_title, 
        string $capability, 
        string $menu_slug, 
        callable $function = '' ) */
    add_options_page( 
        'Configuração dos Recursos para envio de emails', 
        'SMTP API', 
        $capability , 
        $menu_slug , 
        'mostrar_config_smtp_api' );
    
    // Cria tabela que será usada no plugin
    $sql = "CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}smtp_api` (
        `ID` int(11) NOT NULL AUTO_INCREMENT,
        `key` varchar(100) NOT NULL,
        `value` varchar(300) NOT NULL,
        PRIMARY KEY (`id`)
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    
    $wpdb->query($sql);

    $wpdb->get_results("SELECT * FROM `{$wpdb->prefix}smtp_api` WHERE `key` = 'host' ");

    if($wpdb->num_rows <= 0){
        $sql = "INSERT INTO `wp_smtp_api` (`ID`, `key`, `value`) VALUES
        (1, 'host', ''),
        (2, 'user', ''),
        (3, 'password', ''),
        (4, 'from', ''),
        (5, 'to', '');";
    
        $wpdb->query($sql);
    }
    
}

function mostrar_config_smtp_api(){
    include('pagina_principal.php');
}