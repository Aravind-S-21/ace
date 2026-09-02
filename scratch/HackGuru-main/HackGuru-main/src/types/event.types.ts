export interface RawEventImportInput {
  title: string;
  description: string;
  category: string;
  eligibility: string;
  requiredSkills: string[];
  location: string;
  duration: string;
  startDate: string; // ISO date string
  endDate?: string;
  registrationDeadline: string; // ISO date string
  organizer: string;
  externalUrl?: string;
  imageUrl?: string;
}

export interface NormalizedEventPayload {
  title: string;
  description: string;
  category: string;
  eligibility: string;
  requiredSkills: string[];
  location: string;
  duration: string;
  startDate: Date;
  endDate?: Date;
  registrationDeadline: Date;
  organizer: string;
  externalUrl?: string;
  imageUrl?: string;
}
