// Centraliza os nomes de rota para evitar strings soltas no código
export const ROUTE_NAMES = {
  LOGIN:               'login',
  REGISTER:            'cadastro',
  FEED:                'feed',
  CREATE_POST:         'criar',
  POST_DETAILS:        'post-detalhe',
  PROFILE:             'perfil',
  EDIT_PROFILE:        'perfil-editar',
  PROFILE_CONNECTIONS: 'perfil-lista',
  NOT_FOUND:           'not-found',
}

// Tipos válidos de lista de conexões na rota /profile/list/:type
export const CONNECTION_LIST_TYPES = {
  FOLLOWERS: 'seguidores',
  FOLLOWING: 'seguindo',
}
