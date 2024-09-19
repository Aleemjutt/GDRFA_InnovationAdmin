export enum UserType {
  Internal = 1,
  External = 2,
}

export enum StatusCode {
  IsActive = 1,
  InActive = 2,
}

export interface DataKeys {
  [key: string]: any; // Index signature for dynamic keys
  isError?: boolean; // Optional specific property
}

export enum Gender {
  Non = 0,
  Male = 1,
  Female = 2,
  Other = 3,
}

export enum WorkbookType {
  Non = 0,
  WrittenWorks = 1,
  AudioWorks = 2,
  ComputerPrograms = 3,
  VisualWorkbooks = 4,
  DrawingWorkbooks = 5,
  EngineeringDrawingsWorkbooks = 6,
  PhotographicWorks = 7,
  MusicalNnotes = 8,
  FineArt = 9,
}

export enum AuthorNature {
  Non = 0,
  Individual = 1,
  Corporation = 2,
}

export enum AuthorType {
  Non = 0,
  Writer = 1,
  Translator = 2,
  Artist = 3,
  Photographer = 4,
  FineArtist = 5,
  AppliedArtist = 6,
  Calligrapher = 7,
  StructuralEngineer = 8,
  Designer = 9,
  Programmer = 10,
  LeadingTo = 11,
}

export enum AccommodationType {
  Non = 0,
  Citizen = 1,
  Resident = 2,
  Visitor = 3,
  CitizenGulfCooperationCouncilCountries = 4,
  Other = 5,
}
