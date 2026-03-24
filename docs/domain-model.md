# Domain Model

## Entity Relationship Diagram

```
User
 └── Project (1:many)
      ├── CompanyProfile (1:1)
      ├── NarrativeModel (1:1)
      ├── CompetitorProfile (1:many)
      ├── AgentRun (1:many)
      │    └── Opportunity (1:many)
      ├── Asset (1:many)
      ├── Campaign (1:many)
      └── DailyDigest (1:many)
```

## Core Entities

### User
The authenticated user who owns projects.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| email | string | Unique email address |
| name | string | Display name |
| createdAt | timestamp | Record creation time |
| updatedAt | timestamp | Last update time |

### Project
A marketing intelligence project, the top-level organizational unit.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| name | string | Project name |
| description | string | Project description |
| userId | string (FK) | Owner reference |
| createdAt | timestamp | Record creation time |
| updatedAt | timestamp | Last update time |

### CompanyProfile
Company information attached to a project.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| projectId | string (FK, unique) | Associated project |
| companyName | string | Company name |
| industry | string | Industry vertical |
| description | string | Company description |
| website | string (nullable) | Company website URL |
| targetAudience | string (nullable) | Target audience description |

### NarrativeModel
Defines the brand narrative and messaging guidelines.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| projectId | string (FK, unique) | Associated project |
| coreNarrative | string | Core brand narrative |
| toneGuidelines | string | Tone and voice guidelines |
| keyMessages | string[] | Key messaging points |

### CompetitorProfile
A tracked competitor.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| projectId | string (FK) | Associated project |
| name | string | Competitor name |
| website | string (nullable) | Competitor website |
| description | string | Competitor overview |
| strengths | string[] | Known strengths |
| weaknesses | string[] | Known weaknesses |

### Opportunity
An actionable marketing opportunity discovered by an agent.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| projectId | string (FK) | Associated project |
| agentRunId | string (FK) | The run that discovered this |
| title | string | Short title |
| description | string | Detailed description |
| category | enum | content, seo, social, competitive, geographic, trending |
| priority | enum | low, medium, high, critical |
| sourceAgent | string | Agent that found this |
| sourceUrl | string (nullable) | Source reference URL |
| status | enum | new, reviewed, accepted, dismissed, completed |

### Asset
A content asset generated or tracked for a project.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| projectId | string (FK) | Associated project |
| opportunityId | string (FK, nullable) | Related opportunity |
| title | string | Asset title |
| content | string | Asset content body |
| assetType | enum | blog_post, social_post, email, ad_copy, landing_page |
| status | enum | draft, review, approved, published |

### Campaign
A marketing campaign grouping multiple assets and opportunities.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| projectId | string (FK) | Associated project |
| name | string | Campaign name |
| description | string | Campaign description |
| status | enum | planning, active, paused, completed |
| startDate | timestamp (nullable) | Campaign start |
| endDate | timestamp (nullable) | Campaign end |

### AgentRun
A record of an agent execution cycle.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| projectId | string (FK) | Associated project |
| agentName | string | Name of the agent(s) executed |
| status | enum | pending, running, completed, failed, retrying |
| startedAt | timestamp | When execution began |
| completedAt | timestamp (nullable) | When execution finished |
| resultSummary | string (nullable) | Summary of results |
| errorMessage | string (nullable) | Error details if failed |

### DailyDigest
A daily summary of agent findings for a project.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| projectId | string (FK) | Associated project |
| date | timestamp | Digest date |
| summary | string | Human-readable summary |
| opportunityCount | integer | Number of opportunities found |
| topOpportunities | string[] | IDs of top opportunities |
| agentRunIds | string[] | IDs of agent runs included |
