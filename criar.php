<?php
$plugin_data = get_plugin_data( dirname( __FILE__ ) . '/galerias.php' );
$plugin_name = $plugin_data['Name'];

//novo

include_once( plugin_dir_path( __FILE__ ) . 'criar-processar.php' );
?>
<div class="wrap">
    <h1 class="wp-heading-inline"><?php echo $plugin_name ?></h1>
    <h2 class="title">Para adicionar nova galeria preencha o formulário a seguir</h2>
    <form method="post" id="form_add_galerias" enctype="multipart/form-data">
        <table class="form-table">
            <tr>
                <th>Título</th>
                <td><input type="text" maxlength="150" pattern="([A-Z]|[a-z]|[À-Ý]|[à-ý]|[0-9]|\s){6,}.*" name="nome" id="nome" required/><p class="description">Deve ter, no mínimo, 6 letras</p></td>
            </tr>
        </table>
        <h2 class="title">Observaçoes</h2>
        <?php wp_editor( "", 'observacoes', array(
                        'media_buttons' => false,
                        'textarea_rows' => 5,
                        'teeny' => true,
                        'quicktags' => false
                    ) ); ?>
        <br><br><input type="submit" value="Adicionar" class="button button-primary"/>
    </form>
</div>