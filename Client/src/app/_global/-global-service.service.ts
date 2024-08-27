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
import { NumberCardModule } from '@swimlane/ngx-charts';

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
  // private languageSubject: BehaviorSubject<string> =
  //   new BehaviorSubject<string>('en');

  // public languageChange$: Observable<string> =
  //   this.languageSubject.asObservable();

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
    this.languageSubject.next(lang);
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

  // get languageChanged() {
  //   return this.languageSubject.asObservable();
  // }
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

  getAttendanceStatusName(status: number) {
    let statuName = '';
    const currentLanguage = this.getCurrentLanguage();

    switch (status) {
      case 1: // Present
        statuName =
          currentLanguage == 'en'
            ? '<span class="badge badge-success">Present</span>'
            : '<span class="badge badge-success">حاضر</span>';
        break;
      case 2: // Absent
        statuName =
          currentLanguage == 'en'
            ? '<span class="badge badge-danger">Absent</span>'
            : '<span class="badge badge-danger">غائب</span>';
        break;
      case 0: // Non
      default:
        statuName =
          currentLanguage == 'en'
            ? '<span class="badge badge-secondary">Non</span>'
            : '<span class="badge badge-secondary">لا شيء</span>';
        break;
    }

    return statuName;
  }

  getInterviewStatusName(status: number) {
    let statuName = '';
    const currentLanguage = this.getCurrentLanguage();

    switch (status) {
      case 1: // Passed
        statuName =
          currentLanguage == 'en'
            ? '<span class="badge badge-success">Passed</span>'
            : '<span class="badge badge-success">ناجح</span>';
        break;
      case 2: // Fail
        statuName =
          currentLanguage == 'en'
            ? '<span class="badge badge-danger">Fail</span>'
            : '<span class="badge badge-danger">راسب</span>';
        break;
      case 3: // NotAttended
        statuName =
          currentLanguage == 'en'
            ? '<span class="badge badge-warning">Not Attended</span>'
            : '<span class="badge badge-warning">لم يحضر</span>';
        break;
      case 0: // Non
      default:
        statuName =
          currentLanguage == 'en'
            ? '<span class="badge badge-secondary">Non</span>'
            : '<span class="badge badge-secondary">لا شيء</span>';
        break;
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

  getTestStatusName(status: number) {
    let statuName = '';
    const currentLanguage = this.getCurrentLanguage();

    switch (status) {
      case 1: // Passed
        statuName =
          currentLanguage == 'en'
            ? '<span class="badge badge-success">Passed</span>'
            : '<span class="badge badge-success">ناجح</span>';
        break;
      case 2: // Fail
        statuName =
          currentLanguage == 'en'
            ? '<span class="badge badge-danger">Fail</span>'
            : '<span class="badge badge-danger">راسب</span>';
        break;
      case 3: // Not Attended
        statuName =
          currentLanguage == 'en'
            ? '<span class="badge badge-warning">Not Attended</span>'
            : '<span class="badge badge-warning">لم يحضر</span>';
        break;
      case 0: // Non
      default:
        statuName =
          currentLanguage == 'en'
            ? '<span class="badge badge-secondary">Non</span>'
            : '<span class="badge badge-secondary">لا شيء</span>';
        break;
    }

    return statuName;
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

  ConvertDateTimeToDateOnly(dateTime: string | null): string | null {
    if (!dateTime) {
      return null;
    }

    const _datetime = new Date(dateTime);

    // Extract the day, month, and year from the Date object
    const day = _datetime.getDate().toString().padStart(2, '0');
    const month = (_datetime.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = _datetime.getFullYear();

    // Return the date in the format DD-MM-YYYY
    return `${day}-${month}-${year}`;
  }

  ISODateFromate(dateTime: string | null) {
    if (!dateTime) return null;
    const date = new Date(dateTime);

    return date.toISOString().split('T')[0];
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

  getArabicLanguageConfig(): any {
    return {
      loadingRecords: 'جارٍ التحميل...',
      lengthMenu: 'أظهر _MENU_ مدخلات',
      zeroRecords: 'لم يعثر على أية سجلات',
      info: 'إظهار _START_ إلى _END_ من أصل _TOTAL_ مدخل',
      search: 'البحث:',
      paginate: {
        first: 'الأول',
        previous: 'السابق',
        next: 'التالي',
        last: 'الأخير',
      },
      aria: {
        sortAscending: ': تفعيل لترتيب العمود تصاعدياً',
        sortDescending: ': تفعيل لترتيب العمود تنازلياً',
      },
      select: {
        rows: {
          _: '%d قيمة محددة',
          '1': '1 قيمة محددة',
        },
        cells: {
          '1': '1 خلية محددة',
          _: '%d خلايا محددة',
        },
        columns: {
          '1': '1 عمود محدد',
          _: '%d أعمدة محددة',
        },
      },
      buttons: {
        print: 'طباعة',
        copyKeys:
          'زر <i>ctrl</i> أو <i>⌘</i> + <i>C</i> من الجدول<br>ليتم نسخها إلى الحافظة<br><br>للإلغاء اضغط على الرسالة أو اضغط على زر الخروج.',
        pageLength: {
          '-1': 'اظهار الكل',
          _: 'إظهار %d أسطر',
          '1': 'اظهار سطر واحد',
        },
        collection: 'مجموعة',
        copy: 'نسخ',
        copyTitle: 'نسخ إلى الحافظة',
        csv: 'CSV',
        excel: 'Excel',
        pdf: 'PDF',
        colvis: 'إظهار الأعمدة',
        colvisRestore: 'إستعادة العرض',
        copySuccess: {
          '1': 'تم نسخ سطر واحد الى الحافظة',
          _: 'تم نسخ %ds أسطر الى الحافظة',
        },
        createState: 'تكوين حالة',
        removeAllStates: 'ازالة جميع الحالات',
        removeState: 'ازالة حالة',
        renameState: 'تغيير اسم حالة',
        savedStates: 'الحالات المحفوظة',
        stateRestore: 'استرجاع حالة',
        updateState: 'تحديث حالة',
      },
      searchBuilder: {
        add: 'اضافة شرط',
        clearAll: 'ازالة الكل',
        condition: 'الشرط',
        data: 'المعلومة',
        logicAnd: 'و',
        logicOr: 'أو',
        value: 'القيمة',
        conditions: {
          date: {
            after: 'بعد',
            before: 'قبل',
            between: 'بين',
            empty: 'فارغ',
            equals: 'تساوي',
            notBetween: 'ليست بين',
            notEmpty: 'ليست فارغة',
            not: 'ليست ',
          },
          number: {
            between: 'بين',
            empty: 'فارغة',
            equals: 'تساوي',
            gt: 'أكبر من',
            lt: 'أقل من',
            not: 'ليست',
            notBetween: 'ليست بين',
            notEmpty: 'ليست فارغة',
            gte: 'أكبر أو تساوي',
            lte: 'أقل أو تساوي',
          },
          string: {
            not: 'ليست',
            notEmpty: 'ليست فارغة',
            startsWith: ' تبدأ بـ ',
            contains: 'تحتوي',
            empty: 'فارغة',
            endsWith: 'تنتهي ب',
            equals: 'تساوي',
            notContains: 'لا تحتوي',
            notStartsWith: 'لا تبدأ بـ',
            notEndsWith: 'لا تنتهي بـ',
          },
          array: {
            equals: 'تساوي',
            empty: 'فارغة',
            contains: 'تحتوي',
            not: 'ليست',
            notEmpty: 'ليست فارغة',
            without: 'بدون',
          },
        },
        button: {
          '0': 'فلاتر البحث',
          _: 'فلاتر البحث (%d)',
        },
        deleteTitle: 'حذف فلاتر',
        leftTitle: 'محاذاة يسار',
        rightTitle: 'محاذاة يمين',
        title: {
          '0': 'البحث المتقدم',
          _: 'البحث المتقدم (فعال)',
        },
      },
      searchPanes: {
        clearMessage: 'ازالة الكل',
        collapse: {
          '0': 'البحث',
          _: 'البحث (%d)',
        },
        count: 'عدد',
        countFiltered: 'عدد المفلتر',
        loadMessage: 'جارِ التحميل ...',
        title: 'الفلاتر النشطة',
        showMessage: 'إظهار الجميع',
        collapseMessage: 'إخفاء الجميع',
        emptyPanes: 'لا يوجد مربع بحث',
      },
      infoThousands: ',',
      datetime: {
        previous: 'السابق ',
        next: 'التالي',
        hours: 'الساعة',
        minutes: 'الدقيقة',
        seconds: 'الثانية',
        unknown: '-',
        amPm: ['صباحا', 'مساءا'],
        weekdays: [
          'الأحد',
          'الإثنين',
          'الثلاثاء',
          'الأربعاء',
          'الخميس',
          'الجمعة',
          'السبت',
        ],
        months: [
          'يناير',
          'فبراير',
          'مارس',
          'أبريل',
          'مايو',
          'يونيو',
          'يوليو',
          'أغسطس',
          'سبتمبر',
          'أكتوبر',
          'نوفمبر',
          'ديسمبر',
        ],
      },
      editor: {
        close: 'إغلاق',
        create: {
          button: 'إضافة',
          title: 'إضافة جديدة',
          submit: 'إرسال',
        },
        edit: {
          button: 'تعديل',
          title: 'تعديل السجل',
          submit: 'تحديث',
        },
        remove: {
          button: 'حذف',
          title: 'حذف',
          submit: 'حذف',
          confirm: {
            _: 'هل أنت متأكد من رغبتك في حذف السجلات %d المحددة؟',
            '1': 'هل أنت متأكد من رغبتك في حذف السجل؟',
          },
        },
        error: {
          system: 'حدث خطأ ما',
        },
        multi: {
          title: 'قيم متعدية',
          restore: 'تراجع',
          info: 'القيم المختارة تحتوى على عدة قيم لهذا المدخل. لتعديل وتحديد جميع القيم لهذا المدخل، اضغط او انتقل هنا، عدا ذلك سيبقى نفس القيم',
          noMulti: 'هذا المدخل مفرد وليس ضمن مجموعة',
        },
      },
      processing: 'جارٍ المعالجة...',
      emptyTable: 'لا يوجد بيانات متاحة في الجدول',
      infoEmpty: 'يعرض 0 إلى 0 من أصل 0 مُدخل',
      thousands: '.',
      stateRestore: {
        creationModal: {
          columns: {
            search: 'إمكانية البحث للعمود',
            visible: 'إظهار العمود',
          },
          toggleLabel: 'تتضمن',
          button: 'تكوين الحالة',
          name: 'اسم الحالة',
          order: 'فرز',
          paging: 'تصحيف',
          scroller: 'مكان السحب',
          search: 'البحث',
          searchBuilder: 'مكون البحث',
          select: 'تحديد',
          title: 'تكوين حالة جديدة',
        },
        duplicateError: 'حالة مكررة بنفس الاسم',
        emptyError: 'لا يسمح بأن يكون اسم الحالة فارغة.',
        emptyStates: 'لا توجد حالة محفوظة',
        removeConfirm: 'هل أنت متأكد من حذف الحالة %s؟',
        removeError: 'لم استطع ازالة الحالة.',
        removeJoiner: 'و',
        removeSubmit: 'حذف',
        removeTitle: 'حذف حالة',
        renameButton: 'تغيير اسم حالة',
        renameLabel: 'الاسم الجديد للحالة %s:',
        renameTitle: 'تغيير اسم الحالة',
      },
      autoFill: {
        cancel: 'إلغاء الامر',
        fill: 'املأ كل الخلايا بـ <i>%d</i>',
        fillHorizontal: 'تعبئة الخلايا أفقيًا',
        fillVertical: 'تعبئة الخلايا عموديا',
        info: 'تعبئة تلقائية',
      },
      decimal: ',',
      infoFiltered: '(مرشحة من مجموع _MAX_ مُدخل)',
      searchPlaceholder: 'بحث',
    };
  }

  getEnglishLanguageConfig(): any {
    // Define your English language configuration here
    // Example configuration
    return {
      loadingRecords: 'Loading...',
      lengthMenu: 'Show _MENU_ entries',
      zeroRecords: 'No records found',
      info: 'Showing _START_ to _END_ of _TOTAL_ entries',
      search: 'Search:',
      paginate: {
        first: 'First',
        previous: 'Previous',
        next: 'Next',
        last: 'Last',
      },
      aria: {
        sortAscending: ': activate to sort column ascending',
        sortDescending: ': activate to sort column descending',
      },
      select: {
        rows: {
          _: '%d selected values',
          '1': '1 selected value',
        },
        cells: {
          '1': '1 selected cell',
          _: '%d selected cells',
        },
        columns: {
          '1': '1 selected column',
          _: '%d selected columns',
        },
      },
      buttons: {
        print: 'Print',
        copyKeys:
          'Press <i>ctrl</i> or <i>⌘</i> + <i>C</i> to copy the table<br><br>To cancel, click this message or press Esc.',
        pageLength: {
          '-1': 'Show all',
          _: 'Show %d entries',
          '1': 'Show 1 entry',
        },
        collection: 'Collection',
        copy: 'Copy',
        copyTitle: 'Copy to clipboard',
        csv: 'CSV',
        excel: 'Excel',
        pdf: 'PDF',
        colvis: 'Column visibility',
        colvisRestore: 'Restore visibility',
        copySuccess: {
          '1': 'Copied 1 row to the clipboard',
          _: 'Copied %ds rows to the clipboard',
        },
        createState: 'Configure state',
        removeAllStates: 'Remove all states',
        removeState: 'Remove state',
        renameState: 'Rename state',
        savedStates: 'Saved states',
        stateRestore: 'Restore state',
        updateState: 'Update state',
      },
      searchBuilder: {
        add: 'Add condition',
        clearAll: 'Clear all',
        condition: 'Condition',
        data: 'Data',
        logicAnd: 'And',
        logicOr: 'Or',
        value: 'Value',
        conditions: {
          date: {
            after: 'After',
            before: 'Before',
            between: 'Between',
            empty: 'Empty',
            equals: 'Equals',
            notBetween: 'Not between',
            notEmpty: 'Not empty',
            not: 'Not',
          },
          number: {
            between: 'Between',
            empty: 'Empty',
            equals: 'Equals',
            gt: 'Greater than',
            lt: 'Less than',
            not: 'Not',
            notBetween: 'Not between',
            notEmpty: 'Not empty',
            gte: 'Greater than or equal to',
            lte: 'Less than or equal to',
          },
          string: {
            not: 'Not',
            notEmpty: 'Not empty',
            startsWith: 'Starts with',
            contains: 'Contains',
            empty: 'Empty',
            endsWith: 'Ends with',
            equals: 'Equals',
            notContains: 'Does not contain',
            notStartsWith: 'Does not start with',
            notEndsWith: 'Does not end with',
          },
          array: {
            equals: 'Equals',
            empty: 'Empty',
            contains: 'Contains',
            not: 'Not',
            notEmpty: 'Not empty',
            without: 'Without',
          },
        },
        button: {
          '0': 'Search filters',
          _: 'Search filters (%d)',
        },
        deleteTitle: 'Delete filters',
        leftTitle: 'Align left',
        rightTitle: 'Align right',
        title: {
          '0': 'Advanced Search',
          _: 'Advanced Search (%d)',
        },
      },
      searchPanes: {
        clearMessage: 'Clear all',
        collapse: {
          '0': 'Search',
          _: 'Search (%d)',
        },
        count: 'Count',
        countFiltered: 'Count filtered',
        loadMessage: 'Loading...',
        title: 'Active filters',
        showMessage: 'Show All',
        collapseMessage: 'Hide All',
        emptyPanes: 'No search boxes',
      },
      infoThousands: ',',
      datetime: {
        previous: 'Previous',
        next: 'Next',
        hours: 'Hour',
        minutes: 'Minute',
        seconds: 'Second',
        unknown: '-',
        amPm: ['AM', 'PM'],
        weekdays: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
      },
      editor: {
        close: 'Close',
        create: {
          button: 'Add',
          title: 'Add new',
          submit: 'Submit',
        },
        edit: {
          button: 'Edit',
          title: 'Edit record',
          submit: 'Update',
        },
        remove: {
          button: 'Delete',
          title: 'Delete',
          submit: 'Delete',
          confirm: {
            _: 'Are you sure you want to delete %d selected records?',
            '1': 'Are you sure you want to delete this record?',
          },
        },
        error: {
          system: 'An error occurred',
        },
        multi: {
          title: 'Multiple values',
          restore: 'Undo',
          info: 'The selected values contain multiple values for this entry. To edit and select all values for this entry, press or go here, otherwise, the same values will remain',
          noMulti: 'This entry is singular and not part of a group',
        },
      },
      processing: 'Processing...',
      emptyTable: 'No data available in the table',
      infoEmpty: 'Showing 0 to 0 of 0 entries',
      thousands: ',',
      stateRestore: {
        creationModal: {
          columns: {
            search: 'Column searchability',
            visible: 'Column visibility',
          },
          toggleLabel: 'Contains',
          button: 'Configure state',
          name: 'State name',
          order: 'Order',
          paging: 'Paging',
          scroller: 'Scroll position',
          search: 'Search',
          searchBuilder: 'SearchBuilder',
          select: 'Select',
          title: 'Configure new state',
        },
        duplicateError: 'Duplicate state name',
        emptyError: 'State name cannot be empty.',
        emptyStates: 'No saved states',
        removeConfirm: 'Are you sure you want to remove the state %s?',
        removeError: 'Could not remove the state.',
        removeJoiner: 'and',
        removeSubmit: 'Remove',
        removeTitle: 'Remove state',
        renameButton: 'Rename state',
        renameLabel: 'New name for state %s:',
        renameTitle: 'Rename state',
      },
      autoFill: {
        cancel: 'Cancel',
        fill: 'Fill all cells with <i>%d</i>',
        fillHorizontal: 'Fill cells horizontally',
        fillVertical: 'Fill cells vertically',
        info: 'Auto Fill',
      },
      decimal: '.',
      infoFiltered: '(filtered from a total of _MAX_ entries)',
      searchPlaceholder: 'search',
    };
  }

  getVenueType(venue: number | null) {
    if (this.getCurrentLanguage() === 'en') {
      return venue === 1 ? 'Online' : 'OnPremises';
    } else {
      // Arabic or any other language
      return venue === 1 ? 'عبر الإنترنت' : 'في الموقع';
    }
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
