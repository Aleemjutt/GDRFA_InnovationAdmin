import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, forkJoin, map } from 'rxjs'; // RxJS 6 syntax

//Method One
export type Resource = { prefix: string; suffix: string };

export class MultiTranslateHttpLoader implements TranslateLoader {
  resources: Resource[];
  withCommon: boolean;

  constructor(
    private readonly http: HttpClient,
    {
      resources,
      withCommon = true,
    }: { resources: Resource[]; withCommon?: boolean }
  ) {
    this.resources = resources;
    this.withCommon = withCommon;
  }

  getTranslation(lang: string): Observable<Record<string, any>> {
    let resources: Resource[] = [...this.resources];

    if (this.withCommon) {
      // order matters! like this, all translations from common can be overrode with features' translations
      resources: [
        { prefix: './assets/il8n/common/', suffix: '.json' },
        { prefix: './assets/il8n/login/', suffix: '.json' },
        { prefix: './assets/il8n/menu/', suffix: '.json' },
        {
          prefix: './assets/il8n/aboutUs/aboutInnovationCenter/',
          suffix: '.json',
        },
        { prefix: './assets/il8n/aboutUs/agenda/', suffix: '.json' },
        { prefix: './assets/il8n/aboutUs/archives/', suffix: '.json' },
        { prefix: './assets/il8n/aboutUs/awards/', suffix: '.json' },
        { prefix: './assets/il8n/aboutUs/credits/', suffix: '.json' },
        {
          prefix: './assets/il8n/aboutUs/innovationConsulting/',
          suffix: '.json',
        },
        { prefix: './assets/il8n/aboutUs/membership/', suffix: '.json' },
        { prefix: './assets/il8n/aboutUs/partners/', suffix: '.json' },
        { prefix: './assets/il8n/consultingRequest/', suffix: '.json' },
        {
          prefix: './assets/il8n/creativeSupport/DiplomaInCreativeSupport/',
          suffix: '.json',
        },
        {
          prefix: './assets/il8n/futureFocused/dubaiResidancy/',
          suffix: '.json',
        },
        {
          prefix: './assets/il8n/futureFocused/establishedChallengies/',
          suffix: '.json',
        },
        { prefix: './assets/il8n/idea/ideaJurney/', suffix: '.json' },
        { prefix: './assets/il8n/idea/ideaPioneers/', suffix: '.json' },
        { prefix: './assets/il8n/idea/myThoughts/', suffix: '.json' },
        { prefix: './assets/il8n/idea/targetCompain/', suffix: '.json' },
        {
          prefix: './assets/il8n/innovationPossiblities/',
          suffix: '.json',
        },

        {
          prefix:
            './assets/il8n/intellectualProperty/overViewofIntelllectualProperty/',
          suffix: '.json',
        },
        {
          prefix: './assets/il8n/intellectualProperty/registerPropertiesList/',
          suffix: '.json',
        },
        {
          prefix:
            './assets/il8n/intellectualProperty/typeofIntellectualProperty/',
          suffix: '.json',
        },
        { prefix: './assets/il8n/knowledge/goverment/', suffix: '.json' },
        {
          prefix: './assets/il8n/knowledge/innovationBrief/',
          suffix: '.json',
        },
        {
          prefix: './assets/il8n/knowledge/researchCenterAndStudies/',
          suffix: '.json',
        },
        {
          prefix: './assets/il8n/knowledge/version/',
          suffix: '.json',
        },

        {
          prefix: './assets/il8n/researchCenter/',
          suffix: '.json',
        },

        {
          prefix: './assets/il8n/settings/users/',
          suffix: '.json',
        },
        //#endregion User Profile *** End***
      ];
    }

    return forkJoin(
      resources.map((config: Resource) => {
        return this.http.get<Record<string, any>>(
          `${config.prefix}${lang}${config.suffix}`
        );
      })
    ).pipe(
      map((response: Record<string, any>[]) =>
        mergeObjectsRecursively(response)
      )
    );
  }
}

export const mergeObjectsRecursively = (
  objects: Record<string, any>[]
): Record<string, any> => {
  const mergedObject: Record<string, any> = {};

  for (const obj of objects) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          mergedObject[key] = mergeObjectsRecursively([
            mergedObject[key],
            obj[key],
          ]);
        } else {
          mergedObject[key] = obj[key];
        }
      }
    }
  }

  return mergedObject;
};
