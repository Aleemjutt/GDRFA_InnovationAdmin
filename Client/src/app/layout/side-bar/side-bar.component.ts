import { Component } from '@angular/core';
interface MenuItem {
  label: string;
  icon?: string;
  subMenuId?: string;
  subMenuItems?: MenuItem[];
  routerLink?: string;
}
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent {
  openMenu: MenuItem | null = null; // Variable to keep track of the currently open menu
  openSubMenus: { [key: string]: boolean } = {}; // Track the state of open submenus
  menuItems: MenuItem[] = [
    {
      label: 'Dashboards',
      icon: 'ri-dashboard-line csm-icon-color',
      subMenuId: 'submenuDashboards',
      subMenuItems: [],
    },
    {
      label: 'About Us',
      icon: 'ri-group-line csm-icon-color',
      subMenuId: 'submenuAbout', // Unique ID for the submenu
      subMenuItems: [
        {
          label: 'About the Innovation Center',
          icon: 'ri-account-box-line csm-icon-color',
          subMenuId: 'submenuAboutCenter', // Unique ID for the submenu
          subMenuItems: [
            { label: 'Edit', routerLink: 'about/edit' },
            { label: 'Details', routerLink: 'about/details' },
            // Add other submenu items similarly
          ],
        },
        {
          label: 'Membership',
          routerLink: '/memberships',
          icon: 'ri-group-2-line csm-icon-color',
        },
        {
          label: 'Awards',
          routerLink: '/awards',
          icon: 'ri-trophy-line csm-icon-color',
        },
        {
          label: 'Credits',
          routerLink: '/credits',
          icon: 'ri-medal-2-line csm-icon-color',
        },
        {
          label: 'Partners',
          routerLink: '/partners',
          icon: 'ri-folder-user-line csm-icon-color',
        },
        {
          label: 'Archives',
          routerLink: '/archives',
          icon: 'ri-archive-drawer-line csm-icon-color',
        },
        {
          label: 'Agenda',
          routerLink: '/agenda',
          icon: 'ri-calendar-line csm-icon-color',
        },
        {
          label: 'Innovation Consulting',
          routerLink: '/consulting/list',
          icon: 'ri-survey-line csm-icon-color',
        },
        // Add other submenu items similarly
      ],
    },

    {
      label: 'Consulting Requests',
      icon: 'ri-git-pull-request-line csm-icon-color',
      routerLink: '/consultingRequest/List',
    },
    {
      label: 'Idea',
      icon: 'ri-lightbulb-flash-line csm-icon-color',
      subMenuId: 'submenuIdea', // Unique ID for the submenu
      subMenuItems: [
        {
          label: 'My Thoughts',
          icon: 'ri-ping-pong-line csm-icon-color',
          routerLink: '/#',
        },
        {
          label: 'Submit your Idea',
          icon: 'ri-lightbulb-flash-line csm-icon-color',
          routerLink: '/idea/list',
        },
        {
          label: 'Targeted Compaigns',
          icon: 'ri-focus-3-line csm-icon-color',
          routerLink: '/idea/targetCompainList',
        },
        {
          label: 'Idea Tools',
          icon: 'ri-drag-move-line csm-icon-color',
          routerLink: '/idea/tools',
        },
        {
          label: 'Idea Pioneers',
          icon: 'ri-questionnaire-fill csm-icon-color',
          routerLink: '/idea/poineersList',
        },
        {
          label: 'Idea Journey',
          icon: 'ri-china-railway-line csm-icon-color',
          routerLink: '/idea/jurney',
        },
      ],
    },

    {
      label: 'Future Focused',
      icon: 'ri-open-arm-line csm-icon-color',
      subMenuId: 'submenuFF',
      subMenuItems: [
        {
          label: 'Dubai Residancy',
          icon: 'ri-home-4-line csm-icon-color',
          routerLink: '/futureFocused/dubaiResidencyList',
        },
        {
          label: 'Challenge Established',
          icon: 'ri-pencil-ruler-2-line csm-icon-color',
          routerLink: '/futureFocused/establishingFutureFocusedList',
        },
      ],
    },

    {
      label: 'Innovative Possibilities',
      icon: 'ri-building-3-line csm-icon-color',
      subMenuId: 'submenuIPsb',
      subMenuItems: [
        {
          label: 'Innovative Entrepreneurship',
          icon: 'ri-team-line csm-icon-color',
          routerLink: '/innovationPossibilities/innovativeEntrepreneurshipList',
        },
      ],
    },

    {
      label: 'Creative Support',
      icon: 'ri-creative-commons-by-fill csm-icon-color',
      subMenuId: 'submenuCS',
      subMenuItems: [
        {
          label: 'Diploma In Creative Support',
          icon: 'ri-award-line csm-icon-color',
          routerLink: '/creativeSupport/diplomaInCreativeSupport',
        },
        {
          label: 'Innovation Pioneers Club',
          icon: 'ri-team-line csm-icon-color',
          routerLink: '#',
        },
      ],
    },

    {
      label: 'Intellectual Property',
      icon: 'ri-building-line csm-icon-color',
      subMenuId: 'submenuIP',
      subMenuItems: [
        {
          label: 'Overview of Intellectual Property',
          icon: 'ri-git-repository-line csm-icon-color',
          routerLink: '/intellectualProperty/overView',
        },
        {
          label: 'Types of Intellectual Properties',
          icon: 'ri-hotel-fill csm-icon-color',
          routerLink: '/intellectualProperty/type',
        },
        {
          label: 'Registered Properties List',
          icon: 'ri-building-4-line csm-icon-color',
          routerLink: '/intellectualProperty/registeredList',
        },
      ],
    },

    {
      label: 'Knowledge',
      icon: 'ri-graduation-cap csm-icon-color',
      subMenuId: 'submenuKwd',
      subMenuItems: [
        {
          label: 'Research Center and Studies',
          icon: 'ri-git-repository-line csm-icon-color',
          routerLink: '/knowlege/researchAndStudies',
        },
        {
          label: 'Innovation Brief',
          icon: 'ri-hotel-fill csm-icon-color',
          routerLink: '/knowlege/innovationBrief',
        },
        {
          label: 'Version',
          icon: 'ri-building-4-line csm-icon-color',
          routerLink: '/knowlege/versions',
        },
        {
          label: 'Goverment 1',
          icon: 'ri-building-4-line csm-icon-color',
          routerLink: 'knowlege/goverment',
        },
      ],
    },

    {
      label: 'Research Ceneter',
      icon: 'ri-align-vertically csm-icon-color',
      subMenuId: 'submenuResCenter',
      subMenuItems: [
        {
          label: 'Research Center',
          icon: 'ri-align-center csm-icon-color',
          routerLink: '/researchCeneter',
        },

        {
          label: 'Presentations',
          icon: 'ri-tv-2-line csm-icon-color',
          routerLink: '/presentationList',
        },
        // Define other submenu items for Settings similarly
      ],
    },

    {
      label: 'Settings',
      icon: 'ri-list-settings-fill csm-icon-color',
      subMenuId: 'submenuSettings',
      subMenuItems: [
        {
          label: 'Users',
          icon: 'ri-team-line csm-icon-color',
          routerLink: '/users/userList',
        },
        // Define other submenu items for Settings similarly
      ],
    },
    // Define other menu items similarly
  ];

  toggleMenu(menuItem: MenuItem) {
    if (this.openMenu === menuItem) {
      this.openMenu = null;
      this.closeSubMenus();
    } else {
      this.openMenu = menuItem;
      this.closeSubMenus();
      if (menuItem.subMenuId) {
        this.openSubMenus[menuItem.subMenuId] = true;
      }
    }
  }

  closeSubMenus() {
    this.openSubMenus = {};
  }
}
