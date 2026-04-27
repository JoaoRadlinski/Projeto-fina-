// Centraliza os nomes de rota para evitar strings soltas no código
export const ROUTE_NAMES = {
  LOGIN:               'login',
  REGISTER:            'register',
  FEED:                'feed',
  CREATE_POST:         'create-post',
  DISCOVER:            'discover',
  POST_DETAILS:        'post-details',
  PROFILE:             'profile',
  EDIT_PROFILE:        'edit-profile',
  PROFILE_CONNECTIONS: 'profile-connections',
  NOT_FOUND:           'not-found',
}

// Tipos válidos de lista de conexões na rota /profile/list/:type
export const CONNECTION_LIST_TYPES = {
  FOLLOWERS: 'followers',
  FOLLOWING: 'following',
}
