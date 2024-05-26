<?php

if (isset($_GET["editar"])) :

    global $wpdb;
    $wpdb->show_errors();

    if (isset($_POST["host"])) {
        $host = $_POST["host"];
        $wpdb->query("UPDATE `{$wpdb->prefix}smtp_api` SET `value` = '$host' WHERE `key` = 'host' ");
    }

    if (isset($_POST["user"])) {
        $user = $_POST["user"];
        $wpdb->query("UPDATE `{$wpdb->prefix}smtp_api` SET `value` = '$user' WHERE `key` = 'user' ");
    }


    if (isset($_POST["password"])) {
        $password = $_POST["password"];
        $wpdb->query("UPDATE `{$wpdb->prefix}smtp_api` SET `value` = '$password' WHERE `key` = 'password' ");
    }

    if (isset($_POST["from"])) {
        $from = $_POST["from"];
        $wpdb->query("UPDATE `{$wpdb->prefix}smtp_api` SET `value` = '$from' WHERE `key` = 'from' ");
    }

    if (isset($_POST["to"])) {
        $to = $_POST["to"];
        $wpdb->query("UPDATE `{$wpdb->prefix}smtp_api` SET `value` = '$to' WHERE `key` = 'to' ");
    }

    echo "<span class='success'>Dados atualizados com sucesso</span>";

endif;
