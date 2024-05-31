import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ReplyedStatus,
  WorkFlowStatus,
} from '../_models/Common/workflowStatus';
import { environment } from 'src/environments/environment.development';
import {
  Discuss,
  ResearchAndStudiesCategories,
} from '../_models/knowledge/researchAndStudies';
import { ResearchAreaCategory } from '../_models/ResearchCenter/presentation';

@Injectable({
  providedIn: 'root',
})
export class GlobalServiceService implements OnInit {
  currentLang: any = 'en';
  baseUrl = environment.apiUrl;
  imgServerBaseUrl: string = '';
  private languageSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('en');
  public languageChange$: Observable<string> =
    this.languageSubject.asObservable();

  userType: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.getUserType()
  );
  bindLabel: string;
  constructor(
    @Inject(DOCUMENT) private document: Document,

    private translateService: TranslateService,
    private httpClient: HttpClient //private globalService : GlobalServiceService
  ) {
    this.bindLabel = '';
  }
  ngOnInit(): void {
    // this.changeLangage(this.currentLang);
  }
  getCurrentLanguage() {
    const storedLanguage = localStorage.getItem('currentLanguage');
    if (storedLanguage != '' && storedLanguage != null) {
      const _currentLang = storedLanguage
        ? storedLanguage.trim().replace(/["']/g, '')
        : '';
      //localStorage.getItem('currentLanguage');
      //this.currentLang = this.currentLang;

      this.currentLang =
        _currentLang != null || _currentLang != '' ? _currentLang : 'en';
    } else {
      this.currentLang = 'ar';
    }

    return this.currentLang;
  }

  changeLangage(lang: string) {
    //this.currentLangSet = lang;

    let htmlTag = this.document.getElementsByTagName(
      'html'
    )[0] as HTMLHtmlElement;

    localStorage.setItem('currentLanguage', JSON.stringify(lang));
    this.currentLang = lang;
    htmlTag.dir = lang === 'ar' ? 'rtl' : 'ltr';

    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    this.changeCssFile(lang);
  }
  changeCssFile(lang: string) {
    let headTag = this.document.getElementsByTagName(
      'head'
    )[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById(
      'langCss'
    ) as HTMLLinkElement;
    let existing_bootStrapLink = this.document.getElementById(
      'boostrap'
    ) as HTMLLinkElement;

    let bundleName = lang === 'ar' ? 'arabicStyle.css' : 'englishStyle.css';

    let bundleName_Boostrap =
      lang === 'ar' ? 'bootstrapRtl.css' : 'bootstrapLtr.css';

    if (existingLink) {
      existing_bootStrapLink.href = bundleName_Boostrap;
      //existing_bootStrapLink.href;

      existingLink.href = bundleName;
      //existingLink.href;
    } else {
      let newLink_boostrap = this.document.createElement('link');
      newLink_boostrap.rel = 'stylesheet';
      newLink_boostrap.type = 'text/css';
      newLink_boostrap.id = 'boostrap';
      newLink_boostrap.href = bundleName_Boostrap;
      headTag.appendChild(newLink_boostrap);

      let newLink = this.document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.type = 'text/css';
      newLink.id = 'langCss';
      newLink.href = bundleName;

      headTag.appendChild(newLink);
    }
  }

  getUserId() {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    const user = JSON.parse(userString);

    return user.value.userId;
  }

  getUserType() {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    const user = JSON.parse(userString);

    return user.value.roles;
  }

  getUserLogin() {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    const user = JSON.parse(userString);

    return user.value;
  }

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    //console.log('barener token user', user);
    //console.log('barener token user out', user.value.access_token);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.value.access_token,
        'Accept-Language': this.getCurrentLanguage(),
      }),
    };
  }

  getWorkFlowStatusName(workFlow: WorkFlowStatus) {
    let workFlowStatusName = '';

    switch (workFlow) {
      case WorkFlowStatus.UnderProcesses:
        workFlowStatusName =
          this.getCurrentLanguage() == 'en'
            ? '<span class="badge bg-info">Under Evaluation</span>'
            : '<span class="badge bg-info">تحت العملية</span>';
        break;
      case WorkFlowStatus.Reject:
        workFlowStatusName =
          this.getCurrentLanguage() == 'en'
            ? '<span class="badge bg-danger">Rejected</span>'
            : '<span class="badge bg-danger">مرفوض</span>';
        break;
      case WorkFlowStatus.Approved:
        workFlowStatusName =
          this.getCurrentLanguage() == 'en'
            ? '<span class="badge bg-primary">Approved</span>'
            : '<span class="badge bg-primary">موافقة</span>';
        break;
      case WorkFlowStatus.Accept:
        workFlowStatusName =
          this.getCurrentLanguage() == 'en'
            ? '<span class="badge bg-primary">Accepted</span>'
            : '<span class="badge bg-primary">مقبول</span>';
        break;

      default:
        workFlowStatusName =
          this.getCurrentLanguage() == 'en'
            ? '<span class="badge bg-secondary">Submit</span>'
            : '<span class="badge bg-secondary">تقديم</span>';
        break;
    }

    return workFlowStatusName;
  }
  getReplyStatusName(status: ReplyedStatus) {
    let statuName = '';
    if (status == ReplyedStatus.Done) {
      statuName =
        this.getCurrentLanguage() == 'en'
          ? '<span class="badge badge-success">Done</span>'
          : '<span class="badge badge-success">منتهي</span>';
    } else {
      statuName =
        this.getCurrentLanguage() == 'en'
          ? '<span class="badge badge-info">Pending</span>'
          : '<span class="badge badge-info">قيد الانتظار</span>';
    }

    return statuName;
  }

  getStatusName(status: boolean) {
    let statuName = '';
    if (status) {
      statuName =
        this.getCurrentLanguage() == 'en'
          ? '<span class="badge badge-success">Active</span>'
          : '<span class="badge badge-success">نشيط</span>';
    } else {
      statuName =
        this.getCurrentLanguage() == 'en'
          ? '<span class="badge badge-info">In-Active</span>'
          : '<span class="badge badge-info">غير نشط</span>';
    }

    return statuName;
  }

  getWorkbookType(workbookType: number) {
    let workbookTypeName = '';
    const language = this.getCurrentLanguage();

    switch (workbookType) {
      case 1:
        workbookTypeName =
          language === 'en' ? 'Written Works' : 'الأعمال المكتوبة';
        break;
      case 2:
        workbookTypeName =
          language === 'en' ? 'Audio Works' : 'الأعمال الصوتية';
        break;
      case 3:
        workbookTypeName =
          language === 'en' ? 'Computer Programs' : 'برامج الكمبيوتر';
        break;
      case 4:
        workbookTypeName =
          language === 'en' ? 'Visual Workbooks' : 'كتب العمل المرئية';
        break;
      case 5:
        workbookTypeName =
          language === 'en' ? 'Drawing Workbooks' : 'كتب الرسم';
        break;
      case 6:
        workbookTypeName =
          language === 'en'
            ? 'Engineering Drawings Workbooks'
            : 'كتب الرسومات الهندسية';
        break;
      case 7:
        workbookTypeName =
          language === 'en' ? 'Photographic Works' : 'الأعمال الفوتوغرافية';
        break;
      case 8:
        workbookTypeName =
          language === 'en' ? 'Musical Notes' : 'النوتات الموسيقية';
        break;
      case 9:
        workbookTypeName = language === 'en' ? 'Fine Art' : 'الفن الجميل';
        break;
      default:
        workbookTypeName = language === 'en' ? 'Unknown' : 'غير معروف';
    }

    return workbookTypeName;
  }

  getAuthorNature(authorNature: number) {
    let authorNatureName = '';
    const language = this.getCurrentLanguage();

    switch (authorNature) {
      case 1:
        authorNatureName = language === 'en' ? 'Individual' : 'فرد';
        break;
      case 2:
        authorNatureName = language === 'en' ? 'Corporation' : 'مؤسسة';
        break;
      default:
        authorNatureName = language === 'en' ? 'Unknown' : 'غير معروف';
    }

    return authorNatureName;
  }

  getAuthorType(authorType: number) {
    let authorTypeName = '';
    const language = this.getCurrentLanguage();

    switch (authorType) {
      case 1:
        authorTypeName = language === 'en' ? 'Writer' : 'الكاتب';
        break;
      case 2:
        authorTypeName = language === 'en' ? 'Translator' : 'المترجم';
        break;
      case 3:
        authorTypeName = language === 'en' ? 'Artist' : 'الفنان';
        break;
      case 4:
        authorTypeName = language === 'en' ? 'Photographer' : 'المصور';
        break;
      case 5:
        authorTypeName = language === 'en' ? 'Fine Artist' : 'الفنان الجميل';
        break;
      case 6:
        authorTypeName =
          language === 'en' ? 'Applied Artist' : 'الفنان التطبيقي';
        break;
      case 7:
        authorTypeName = language === 'en' ? 'Calligrapher' : 'الخطاط';
        break;
      case 8:
        authorTypeName =
          language === 'en' ? 'Structural Engineer' : 'المهندس الإنشائي';
        break;
      case 9:
        authorTypeName = language === 'en' ? 'Designer' : 'المصمم';
        break;
      case 10:
        authorTypeName = language === 'en' ? 'Programmer' : 'المبرمج';
        break;
      case 11:
        authorTypeName = language === 'en' ? 'Leading To' : 'المؤدي إلى';
        break;
      default:
        authorTypeName = language === 'en' ? 'Unknown' : 'غير معروف';
    }

    return authorTypeName;
  }

  getCountryName(countryValue: number) {
    let countryName = '';
    const language = this.getCurrentLanguage();

    switch (countryValue) {
      case 1:
        countryName = language === 'en' ? 'United Kingdom' : 'المملكة المتحدة';
        break;
      case 2:
        countryName = language === 'en' ? 'France' : 'فرنسا';
        break;
      case 3:
        countryName = language === 'en' ? 'Germany' : 'ألمانيا';
        break;
      case 4:
        countryName = language === 'en' ? 'Italy' : 'إيطاليا';
        break;
      case 5:
        countryName = language === 'en' ? 'Japan' : 'اليابان';
        break;
      case 6:
        countryName = language === 'en' ? 'Spain' : 'إسبانيا';
        break;
      case 7:
        countryName = language === 'en' ? 'United States' : 'الولايات المتحدة';
        break;
      case 8:
        countryName = language === 'en' ? 'India' : 'الهند';
        break;
      case 9:
        countryName = language === 'en' ? 'Pakistan' : 'باكستان';
        break;
      case 10:
        countryName =
          language === 'en'
            ? 'The United Arab Emirates'
            : 'الإمارات العربية المتحدة';
        break;
      case 11:
        countryName =
          language === 'en'
            ? 'Kingdom of Saudi Arabia'
            : 'المملكة العربية السعودية';
        break;
      default:
        countryName = language === 'en' ? 'Unknown' : 'غير معروف';
    }

    return countryName;
  }

  getDiscuss(discussValue: number | null): string {
    let discussName = '';
    const language = this.getCurrentLanguage(); // Assume this function returns 'en' or 'ar'

    switch (discussValue) {
      case Discuss.InstitutionalSupportSector:
        discussName =
          language === 'en'
            ? 'Institutional Support Sector'
            : 'قطاع الدعم المؤسسي';
        break;
      case Discuss.ViolatorsAndForeignersFollowupSector:
        discussName =
          language === 'en'
            ? 'Violators and Foreigners Follow-up Sector'
            : 'قطاع متابعة المخالفين والأجانب';
        break;
      case Discuss.LandandAirPortssector:
        discussName =
          language === 'en'
            ? 'Land and Air Ports Sector'
            : 'قطاع الموانئ البرية والجوية';
        break;
      case Discuss.HumanAndFinancialResourcessector:
        discussName =
          language === 'en'
            ? 'Human and Financial Resources Sector'
            : 'قطاع الموارد البشرية والمالية';
        break;
      case Discuss.EntryandResidencePermitssector:
        discussName =
          language === 'en'
            ? 'Entry and Residence Permits Sector'
            : 'قطاع تصاريح الدخول والإقامة';
        break;
      case Discuss.NationalityAffairsSector:
        discussName =
          language === 'en'
            ? 'Nationality Affairs Sector'
            : 'قطاع شؤون الجنسية';
        break;
      case Discuss.Airportssector:
        discussName = language === 'en' ? 'Airports Sector' : 'قطاع المطارات';
        break;
      default:
        discussName = language === 'en' ? 'Unknown' : 'غير معروف';
    }

    return discussName;
  }

  getResearchAndStudiesCategory(categoryValue: number | null): string {
    let categoryName = '';
    const language = this.getCurrentLanguage(); // Assume this function returns 'en' or 'ar'

    switch (categoryValue) {
      case ResearchAndStudiesCategories.ScholarsResearchMastersAndPhD:
        categoryName =
          language === 'en'
            ? 'Scholars Research Masters and PhD'
            : 'أبحاث العلماء الماجستير والدكتوراه';
        break;
      case ResearchAndStudiesCategories.InnovativeResearch:
        categoryName =
          language === 'en' ? 'Innovative Research' : 'أبحاث مبتكرة';
        break;
      case ResearchAndStudiesCategories.AccreditedResearch:
        categoryName =
          language === 'en' ? 'Accredited Research' : 'أبحاث معتمدة';
        break;
      default:
        categoryName = language === 'en' ? 'Unknown' : 'غير معروف';
    }

    return categoryName;
  }

  getImgServerBaseUrl(base64String: string | null): string {
    //console.log(base64String, 'Base 64');
    this.imgServerBaseUrl = '';
    if (base64String) {
      this.imgServerBaseUrl = 'data:image/*;base64,' + base64String;
    }
    // console.log(base64String, 'Combined Base 64');
    // this.httpClient.get<string>(this.baseUrl + 'FilePath?url=' + url).subscribe(
    //   (response) => {
    //     this.imgServerBaseUrl = 'data:image/jpeg;base64,' + response;
    //   },
    //   (error) => {
    //     console.error('Error fetching image:', error);
    //   }
    // );

    return this.imgServerBaseUrl;
  }

  isBase64Image(base64String: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true); // Image loaded successfully
      img.onerror = () => resolve(false); // Error loading image

      // Set the Base64 string as the image source
      img.src = base64String;
    });
  }

  async checkImage(base64String: string) {
    const isValid = await this.isBase64Image(base64String);
    console.log(isValid ? 'Valid image' : 'Invalid image');

    return isValid;
  }

  convertDatetime(datetime: string) {
    let formattedDate = '';
    const _datetime = new Date(datetime);

    const year = _datetime.getFullYear();
    const monthNumber = _datetime.getMonth() + 1;
    const dayNumber = _datetime.getDate();
    let hour = _datetime.getHours();
    const minute = _datetime.getMinutes();

    // Zero-padding for month and day
    const month = monthNumber < 10 ? '0' + monthNumber : monthNumber;
    const day = dayNumber < 10 ? '0' + dayNumber : dayNumber;

    // Convert 24-hour format to 12-hour format and determine AM/PM
    const amPm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format

    // Format the time string
    const formattedTime = `${hour}:${
      minute < 10 ? '0' + minute : minute
    } ${amPm}`;

    // Construct the final formatted date string

    // Zero-padding for month and day

    formattedDate = `${year}-${month}-${day} ${formattedTime}`;

    console.log(formattedDate); // Output: "2024-5-21 9:25 AM"

    return formattedDate;
  }

  getResearchAreaName(researchArea: ResearchAreaCategory | null): string {
    let researchAreaName = '';
    const language = this.getCurrentLanguage();

    switch (researchArea) {
      case 1:
        researchAreaName =
          language === 'en'
            ? 'Forgery and document examination'
            : 'تزوير وفحص المستندات';
        break;
      case 2:
        researchAreaName =
          language === 'en' ? 'Institutional innovation' : 'الابتكار المؤسسي';
        break;
      case 3:
        researchAreaName =
          language === 'en'
            ? 'Nationality and Passport Affairs'
            : 'شؤون الجنسية وجواز السفر';
        break;
      case 4:
        researchAreaName =
          language === 'en'
            ? 'Affairs of violators of residency laws and entry permits'
            : 'شؤون مخالفي قوانين الإقامة وتصاريح الدخول';
        break;
      default:
        researchAreaName = language === 'en' ? 'Unknown' : 'غير معروف';
    }

    return researchAreaName;
  }

  // getImgServerBaseUrl(): Observable<string> {
  //   return this.getFromServerBaseUrl().pipe(
  //     map(() => 'http://localhost:44350/InnovationImages/'),
  //     catchError(() => 'http://localhost:44350/InnovationImages/')
  //   );
  // }

  // getFromServerBaseUrl(): Observable<any> {
  //   return this.httpClient.get<any>(
  //     this.baseUrl + 'FilePath',
  //     this.getHttpOptions()
  //   );
  // }
  // getImgServerBaseUrl() {
  //   const fromServer = this.getFromServerBaseUrl();
  //   console.log('server file path', fromServer);
  //   if (fromServer) {
  //     return 'http:\\localhost:44350\\InnovationImages\\';
  //   } else {
  //     return fromServer; //'http:\\localhost:44350\\InnovationImages\\';
  //   }
  // }

  // getFromServerBaseUrl() {
  //   // Replace 'http:\\localhost:44350\\InnovationImages\\' with your default string value
  //   //const defaultValue = 'htpps//:';
  //   return this.httpClient.put<any>(
  //     this.baseUrl + 'FilePath',
  //     this.getHttpOptions()
  //   );
  // }

  downloadPdf(base64String: string, fileName: string): void {
    const linkSource = `data:application/pdf;base64,${base64String}`;
    const downloadLink = document.createElement('a');
    const fileNameWithExtension = `${fileName}.pdf`;

    downloadLink.href = linkSource;
    downloadLink.download = fileNameWithExtension;
    downloadLink.click();
  }

  downloadjpg(base64String: string, fileName: string): void {
    const linkSource = `data:application/jpg;base64,${base64String}`;
    const downloadLink = document.createElement('a');
    const fileNameWithExtension = `${fileName}.pdf`;

    downloadLink.href = linkSource;
    downloadLink.download = fileNameWithExtension;
    downloadLink.click();
  }
}
