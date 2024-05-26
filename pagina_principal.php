<?php

global $wpdb;

$userID = get_current_user_id();
$actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]:$_SERVER[SERVER_PORT]$_SERVER[REQUEST_URI]";
$base_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]:$_SERVER[SERVER_PORT]$_SERVER[PHP_SELF]?page=smtp_api";

include_once(plugin_dir_path(__FILE__) . 'editar-processar.php');
include_once(plugin_dir_path(__FILE__) . 'enviar-processar.php');

$host = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'host' ");
$user = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'user' ");
$pass = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'password' ");
$to = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'to' ");
$from = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'from' ");

?>

<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">

<div class="wrap">
    <h1 class="wp-heading-inline"><?= get_admin_page_title() ?></h1>
    <h2>Parâmetros de configuração</h2>
    <p>Você deve atualizar a página antes de enviar o email de teste caso tenha feito alguma alteração de parâmetros</p>
    <form method="post">
        <table class="form-table">
            <tr>
                <th>Host SMTP</th>
                <td><input type="text" name="host" value="<?= $host ?>" required />
                </td>
            </tr>
            <tr>
                <th>Usuário</th>
                <td><input type="text" name="user" value="<?= $user ?>" />
                </td>
            </tr>
            <tr>
                <th>Senha</th>
                <td><input type="text" name="password" value="<?= $pass ?>" />
                </td>
            </tr>
            <tr>
                <th>Remetente</th>
                <td><input type="text" name="from" value="<?= $from ?>" required />
                </td>
            </tr>
            <tr>
                <th>Destinatário de teste</th>
                <td><input type="text" name="to" value="<?= $to ?>" required />
                </td>
            </tr>
        </table>
        <button type="submit" class="button button-primary" formaction="<?= $base_link ?>&editar">Atualizar dados</button>
        <button type="submit" class="button button-primary" formaction="<?= $base_link ?>&enviar">Enviar email de teste</button>
    </form>
</div>