<?php

// Roles AND capabilities
function wporg_smtp_api_role()
{
    add_role(
        'smtp',
        'Editor de Configurações SMTP',
        [
            'read'         => true,
            'edit_posts'   => true,
        ]
    );
}

add_action('init', 'wporg_smtp_api_role', 10);

function wporg_smtp_api_role_caps()
{
    // gets the simple_role role object
    $role = get_role('smtp');
    $role->add_cap('smtp_config', true);

    $role = get_role('administrator');
    $role->add_cap('smtp_config', true);
}
 
// add simple_role capabilities, priority must be after the initial role definition
add_action('init', 'wporg_smtp_api_role_caps', 11);

?>