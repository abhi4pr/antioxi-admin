const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard'
        },
        {
          id: 'motivationals',
          title: 'Motivationals',
          type: 'item',
          url: '/motivationals',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'questions',
          title: 'Questions',
          type: 'item',
          url: '/questions',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'tasks',
          title: 'Daily Tasks',
          type: 'item',
          url: '/tasks',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'videos',
          title: 'Videos & status',
          type: 'item',
          url: '/videos',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'users',
          title: 'Users',
          type: 'item',
          url: '/users',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'posts',
          title: 'Community Posts',
          type: 'item',
          url: '/posts',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        // {
        //   id: 'moods',
        //   title: 'User Moods',
        //   type: 'item',
        //   url: '/moods',
        //   classes: 'nav-item',
        //   icon: 'feather icon-sidebar'
        // },
        {
          id: 'feedbacks',
          title: 'Feedbacks',
          type: 'item',
          url: '/feedbacks',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'rewards',
          title: 'Rewards',
          type: 'item',
          url: '/rewards',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
        {
          id: 'audio',
          title: 'Audio',
          type: 'item',
          url: '/audios',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        },
      ]
    }
  ]
};

export default menuItems;
