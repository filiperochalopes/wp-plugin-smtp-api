<?php
$plugin_data = get_plugin_data( dirname( __FILE__ ) . '/galerias.php' );
$plugin_name = $plugin_data['Name'];

//novo

$userID = get_current_user_id();
?>
<div class="wrap">
    <h1 class="wp-heading-inline"><?php echo $plugin_name ?></h1><a href="<?php echo get_admin_url( null, '', 'admin' ) ?>admin.php?page=eventos-novo" class="page-title-action">
    Criar nova</a><br />
    Aqui ficar uma listagem sem capa, apenas com uma lista estilizada com títulos número de imagens // Colocar também local para EDITAR GUIAS
    <?=$userID?>
    <?php echo wp_get_current_user()->user_firstname; ?>
</div>