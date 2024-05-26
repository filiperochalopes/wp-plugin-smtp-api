<?php
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require 'vendor/autoload.php';

// Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

if (isset($_GET["enviar"])) :

    global $wpdb;
    
    $host = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'host' ");
    $user = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'user' ");
    $pass = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'password' ");
    $to = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'to' ");
    $from = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'from' ");

    $wpdb->show_errors();

    $corpo_texto = "<p>" .
        "<b>E-mail de Teste:</b> <br />" .
        "<b>Mensagem: </b> Teste de email <br />" .
        "<b>Mensagem: </b> Enviada às: " . date("d-m-Y H:i:s") . " <br />" .
        "<p>";
    $mail->IsSMTP();
    $mail->HeaderLine("Content-type", "text/html");
    $mail->HeaderLine("charset", "utf-8");
    $mail->CharSet = "utf-8";
    $mail->SetLanguage('br');
    $mail->From = $user;
    $mail->FromName = $from;
    $mail->Host = $host;
    $mail->Port = 465;
    $mail->SMTPAuth = true;
    $mail->Username = $user;
    $mail->Password = $pass;
    $mail->SMTPSecure = 'ssl';
    $mail->SMTPAutoTLS = false;
    $mail->AddAddress($to, "Remetente de Teste");
    //$mail->AddCC('xxx@hotmail.com', 'Teste 02'); // Copia
    //$mail->AddBCC('yyy@gmail.com', 'Teste 03'); // Cópia Oculta
    $mail->WordWrap = 50;
    $mail->IsHTML(true);
    $mail->Subject = "Teste de envio de email - INTRANET";
    $mail->Body = $corpo_texto;
    $enviado = true;
    $enviado = $mail->Send();

    print_r($enviado);
    echo "<span class='success'>Email enviado com Sucesso!!!</span>";

endif;
