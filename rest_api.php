<?php

// API WP
add_action('rest_api_init', function () {
    register_rest_route('smtp/v1', '/contato', array(
        'methods' => 'POST',
        'callback' => 'send_email',
    ));
});

function send_email($data)
{
    global $wpdb;
    require_once("phpmailer/class.phpmailer.php");

    $host = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'host' ");
    $user = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'user' ");
    $pass = $wpdb->get_var("SELECT `value` FROM {$wpdb->prefix}smtp_api WHERE `key` = 'password' ");
    $to = "comercial.lithocenter@gmail.com";
    $from = "naoresponda@filipelopes.me";

    $name = $data["name"];
    $email = $data["email"];
    $subject = $data["subject"];
    $message = $data["message"];

    $corpo_texto = "<p>" .
        "{$message} **TESTE**<br/><br/>" .
        "<b> {$name} </b><br/>" .
        "<sub>Enviada às: " . date("d-m-Y H:i:s") . "</sub><br/>" .
        "<p>";

    $mail = new phpmailer();
    $mail->IsSMTP();
    $mail->HeaderLine("Content-type", "text/html");
    $mail->HeaderLine("charset", "utf-8");
    $mail->CharSet = "utf-8";
    $mail->SetLanguage('br');
    $mail->addReplyTo($email, $name);
    $mail->From = $from;
    $mail->FromName = "[LITHOCENTER] Servidor SMTP";
    $mail->Host = $host;
    $mail->Port = 465;
    $mail->SMTPAuth = true;
    $mail->Username = $user;
    $mail->Password = $pass;
    $mail->SMTPSecure = 'ssl';
    $mail->SMTPAutoTLS = false;
    $mail->AddAddress($to, "Comercial Lithocenter");
    //$mail->AddCC('xxx@hotmail.com', 'Teste 02'); // Copia
    //$mail->AddBCC('yyy@gmail.com', 'Teste 03'); // Cópia Oculta
    $mail->WordWrap = 50;
    $mail->IsHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $corpo_texto;
    $mail->AltBody = $message;
    $sent = true;
    $sent = $mail->Send();

    if ($sent) {
        return array(
            "status" => "Email enviado com sucesso"
        );
    } else {
        return array(
            "status" => "Falha no envio do email"
        );
    }
}
