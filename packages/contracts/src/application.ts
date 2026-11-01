// general application-information to be displayed in card's
export type ApplicationStatus =
  | 'SAVED' // Not yet Applied
  | 'APPLIED'
  | 'OFFER' // received an offer, accepted
  | 'INTERVIEW' // got a response, interview schedul
  | 'REJECTED';

  export type JobType =
    | 'FULL_TIME'
    | 'PART_TIME'
    | 'REMOTE'
    | 'HYBRID'
    | 'INTERNSHIP'
    | 'CONTRACT'
    | 'UNKNOWN';

export interface ApplicationCard {
  id: string
  company: string
  title: string
  status: ApplicationStatus
  notes: string | null
  createdAt: Date
}

export interface ApplicationDetaill extends ApplicationCard {
  role: string
  summary: string
  companyEmail: string | null
  phone: string | null
  postedAt: Date | null
  website: string | null
  location: string | null
  salaryMin: number | null
  salaryMax: number | null
  jobType: JobType
  deadline: Date | null
  requirements: string[]
  sourceBoard:  String | null
  appliedAt: Date | null
}