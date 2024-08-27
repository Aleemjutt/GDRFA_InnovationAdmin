import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
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
export class SideBarComponent implements OnInit {
  openMenu: MenuItem | null = null; // Variable to keep track of the currently open menu
  menuItems: MenuItem[] = [];
  openSubMenus: { [key: string]: boolean } = {}; // Track the state of open submenus
  private languageChangeSubscription!: Subscription;
  constructor(
    private GlobalService: GlobalServiceService,

    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.languageChangeSubscription = new Subscription();
  }

  ngOnInit() {
    //this.updateMenuItems();
    // this.GlobalService.languageChanged.subscribe(() => {
    //   this.updateMenuItems();
    // });

    this.languageChangeSubscription =
      this.GlobalService.languageChange$.subscribe((lang) => {
        // Update the ng-select label property when the language changes
        this.updateMenuItems();
      });
  }

  updateMenuItems() {
    console.log('call updated menue');
    this.menuItems = [
      {
        label:
          this.GlobalService.getCurrentLanguage() === 'en'
            ? 'Dashboards'
            : 'لوحات التحكم',
        icon: 'ri-dashboard-line csm-icon-color',
        subMenuId: 'submenuDashboards',
        subMenuItems: [],
        routerLink: '/home',
      },
      {
        label:
          this.GlobalService.getCurrentLanguage() === 'en'
            ? 'About Us'
            : 'معلومات عنا',
        icon: 'ri-group-line csm-icon-color',
        subMenuId: 'submenuAbout',
        subMenuItems: [
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'About the Innovation Center'
                : 'حول مركز الابتكار',
            icon: 'ri-account-box-line csm-icon-color',
            subMenuId: 'submenuAboutCenter',
            subMenuItems: [
              {
                label:
                  this.GlobalService.getCurrentLanguage() === 'en'
                    ? 'Edit'
                    : 'تعديل',
                routerLink: 'about/edit',
              },
              // {
              //   label:
              //     this.GlobalService.getCurrentLanguage() === 'en'
              //       ? 'Details'
              //       : 'تفاصيل',
              //   routerLink: 'about/details',
              // },
            ],
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Membership'
                : 'عضوية',
            routerLink: '/memberships',
            icon: 'ri-group-2-line csm-icon-color',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Awards'
                : 'الجوائز',
            routerLink: '/awards',
            icon: 'ri-trophy-line csm-icon-color',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Credits'
                : 'ائتمانات',
            routerLink: '/credits',
            icon: 'ri-medal-2-line csm-icon-color',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Partners'
                : 'شركاء',
            routerLink: '/partners',
            icon: 'ri-folder-user-line csm-icon-color',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Archives'
                : 'الأرشيف',
            routerLink: '/archives',
            icon: 'ri-archive-drawer-line csm-icon-color',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Agenda'
                : 'جدول الأعمال',
            routerLink: '/agenda',
            icon: 'ri-calendar-line csm-icon-color',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Innovation Consulting'
                : 'استشارات الابتكار',
            routerLink: '/consulting/list',
            icon: 'ri-survey-line csm-icon-color',
          },
        ],
      },
      {
        label:
          this.GlobalService.getCurrentLanguage() === 'en'
            ? 'Consulting Requests'
            : 'طلبات الاستشارات',
        icon: 'ri-git-pull-request-line csm-icon-color',
        routerLink: '/consultingRequest/List',
      },
      {
        label:
          this.GlobalService.getCurrentLanguage() === 'en' ? 'Idea' : 'فكرة',
        icon: 'ri-lightbulb-flash-line csm-icon-color',
        subMenuId: 'submenuIdea',
        subMenuItems: [
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'My Thoughts'
                : 'أفكاري',
            icon: 'ri-ping-pong-line csm-icon-color',
            routerLink: '/#',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Submit your Idea'
                : 'قدم فكرتك',
            icon: 'ri-lightbulb-flash-line csm-icon-color',
            routerLink: '/idea/list',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Targeted Campaigns'
                : 'الحملات المستهدفة',
            icon: 'ri-focus-3-line csm-icon-color',
            routerLink: '/idea/targetCompainList',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Idea Tools'
                : 'أدوات الفكرة',
            icon: 'ri-drag-move-line csm-icon-color',
            routerLink: '/idea/tools',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Idea Pioneers'
                : 'رواد الأفكار',
            icon: 'ri-questionnaire-fill csm-icon-color',
            routerLink: '/idea/poineersList',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Idea Journey'
                : 'رحلة الفكرة',
            icon: 'ri-china-railway-line csm-icon-color',
            routerLink: '/idea/jurney',
          },
        ],
      },
      {
        label:
          this.GlobalService.getCurrentLanguage() === 'en'
            ? 'Future Focused'
            : 'التركيز على المستقبل',
        icon: 'ri-open-arm-line csm-icon-color',
        subMenuId: 'submenuFF',
        subMenuItems: [
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Dubai Residency'
                : 'إقامة دبي',
            icon: 'ri-home-4-line csm-icon-color',
            routerLink: '/futureFocused/dubaiResidencyList',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Challenge Established'
                : 'تحدي التأسيس',
            icon: 'ri-pencil-ruler-2-line csm-icon-color',
            routerLink: '/futureFocused/establishingFutureFocusedList',
          },
        ],
      },
      {
        label:
          this.GlobalService.getCurrentLanguage() === 'en'
            ? 'Innovative Possibilities'
            : 'إمكانيات مبتكرة',
        icon: 'ri-building-3-line csm-icon-color',
        subMenuId: 'submenuIPsb',
        subMenuItems: [
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Innovative Entrepreneurship'
                : 'ريادة الأعمال المبتكرة',
            icon: 'ri-team-line csm-icon-color',
            routerLink:
              '/innovationPossibilities/innovativeEntrepreneurshipList',
          },
        ],
      },
      {
        label:
          this.GlobalService.getCurrentLanguage() === 'en'
            ? 'Creative Support'
            : 'الدعم الإبداعي',
        icon: 'ri-creative-commons-by-fill csm-icon-color',
        subMenuId: 'submenuCS',
        subMenuItems: [
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Diploma In Creative Support'
                : 'دبلوم في الدعم الإبداعي',
            icon: 'ri-award-line csm-icon-color',
            routerLink: '/creativeSupport/diplomaInCreativeSupport',
          },

          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Join Program'
                : 'الانضمام إلى البرنامج',
            icon: 'ri-user-add-fill csm-icon-color',
            subMenuId: 'submenuJoinProgram',
            subMenuItems: [
              // {
              //   label:
              //     this.GlobalService.getCurrentLanguage() === 'en'
              //       ? 'Participates Tests List'
              //       : 'قائمة الاختبارات المشاركة',
              //   icon: 'ri-a-b csm-icon-color',
              //   routerLink: '/creativeSupport/joinProgram',
              // },
              {
                label:
                  this.GlobalService.getCurrentLanguage() === 'en'
                    ? 'Programs List'
                    : 'قائمة البرامج',
                icon: 'ri-a-b csm-icon-color',
                routerLink: '/creativeSupport/listProgram',
              },
              {
                label:
                  this.GlobalService.getCurrentLanguage() === 'en'
                    ? 'Add Program'
                    : 'قائمة الاختبارات المشاركة',
                icon: 'ri-a-b csm-icon-color',
                routerLink: '/creativeSupport/addProgram/0/0',
              },
            ],
          },

          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Innovation Pioneers Club'
                : 'نادي رواد الابتكار',
            icon: 'ri-team-line csm-icon-color',
            routerLink: '#',
          },
        ],
      },
      {
        label:
          this.GlobalService.getCurrentLanguage() === 'en'
            ? 'Intellectual Property'
            : 'الملكية الفكرية',
        icon: 'ri-building-line csm-icon-color',
        subMenuId: 'submenuIP',
        subMenuItems: [
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Overview of Intellectual Property'
                : 'نظرة عامة على الملكية الفكرية',
            icon: 'ri-git-repository-line csm-icon-color',
            routerLink: '/intellectualProperty/overView',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Types of Intellectual Properties'
                : 'أنواع الملكيات الفكرية',
            icon: 'ri-hotel-fill csm-icon-color',
            routerLink: '/intellectualProperty/type',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Registered Properties List'
                : 'قائمة الملكيات المسجلة',
            icon: 'ri-building-4-line csm-icon-color',
            routerLink: '/intellectualProperty/registeredList',
          },
        ],
      },
      {
        label:
          this.GlobalService.getCurrentLanguage() === 'en'
            ? 'Knowledge'
            : 'المعرفة',
        icon: 'ri-graduation-cap csm-icon-color',
        subMenuId: 'submenuKwd',
        subMenuItems: [
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Research Center and Studies'
                : 'مركز الأبحاث والدراسات',
            icon: 'ri-git-repository-line csm-icon-color',
            routerLink: '/knowlege/researchAndStudies',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Innovation Brief'
                : 'موجز الابتكار',
            icon: 'ri-hotel-fill csm-icon-color',
            routerLink: '/knowlege/innovationBrief',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Version'
                : 'الإصدار',
            icon: 'ri-building-4-line csm-icon-color',
            routerLink: '/knowlege/versions',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Government 1'
                : 'الحكومة 1',
            icon: 'ri-building-4-line csm-icon-color',
            routerLink: 'knowlege/goverment',
          },
        ],
      },
      {
        label:
          this.GlobalService.getCurrentLanguage() === 'en'
            ? 'Research Center'
            : 'مركز البحوث',
        icon: 'ri-align-vertically csm-icon-color',
        subMenuId: 'submenuResCenter',
        subMenuItems: [
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Research Center'
                : 'مركز البحوث',
            icon: 'ri-align-center csm-icon-color',
            routerLink: '/researchCeneter',
          },
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Presentations'
                : 'العروض التقديمية',
            icon: 'ri-tv-2-line csm-icon-color',
            routerLink: '/presentationList',
          },
        ],
      },
      {
        label:
          this.GlobalService.getCurrentLanguage() === 'en'
            ? 'Settings'
            : 'الإعدادات',
        icon: 'ri-list-settings-fill csm-icon-color',
        subMenuId: 'submenuSettings',
        subMenuItems: [
          {
            label:
              this.GlobalService.getCurrentLanguage() === 'en'
                ? 'Users'
                : 'المستخدمون',
            icon: 'ri-team-line csm-icon-color',
            routerLink: '/users/userList',
          },
        ],
      },
    ];
    //this.changeDetectorRef.detectChanges();
  }

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
    //this.changeDetectorRef.detectChanges();
  }

  closeSubMenus() {
    this.openSubMenus = {};
  }
}
