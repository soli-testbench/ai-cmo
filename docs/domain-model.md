# Domain Model

This document describes every domain entity in the Chief MOG Officer platform, their fields, and the relationships between them.

## Entity Relationship Diagram

```
+----------+       +-------------+       +------------------+
|   User   |1----*>|   Project   |1----*>|  CompanyProfile  |
+----------+       +------+------+       +------------------+
                          |
          +---------------+----------------+-----------+
          |               |                |           |
          v               v                v           v
  +-------+------+ +------+-------+ +-----+----+ +----+------+
  |NarrativeModel| |CompetitorProf| |Opportunity| | Campaign  |
  +--------------+ +--------------+ +-----+----+ +-----------+
                                          |
                                          v
                                    +-----+----+
                                    |  Asset   |
                                    +----------+

  +----------+       +--------------+
  | AgentRun |       | DailyDigest  |
  +----------+       +--------------+
       ^                    ^
       |                    |
       +--- belong to Project (via projectId)
```

## Entities

### User

Represents a platform user.

| Field     | Type                         | Description                         |
| --------- | ---------------------------- | ----------------------------------- |
| id        | UUID                         | Primary key                         |
| email     | string                       | Unique email address                |
| name      | string                       | Display name                        |
| role      | enum: `admin`, `member`      | Authorization role                  |
| createdAt | timestamp                    | Record creation time                |
| updatedAt | timestamp                    | Last update time                    |

### Project

Top-level organizational unit. A user can own many projects.

| Field            | Type                                    | Description                            |
| ---------------- | --------------------------------------- | -------------------------------------- |
| id               | UUID                                    | Primary key                            |
| name             | string                                  | Project name                           |
| description      | string                                  | Brief description                      |
| companyProfileId | UUID (nullable)                         | Link to the associated company profile |
| userId           | UUID                                    | Owning user                            |
| status           | enum: `active`, `paused`, `archived`    | Lifecycle status                       |
| createdAt        | timestamp                               | Record creation time                   |
| updatedAt        | timestamp                               | Last update time                       |

### CompanyProfile

Describes the company being tracked within a project.

| Field       | Type       | Description                          |
| ----------- | ---------- | ------------------------------------ |
| id          | UUID       | Primary key                          |
| projectId   | UUID       | Parent project                       |
| name        | string     | Company name                         |
| industry    | string     | Industry vertical                    |
| description | string     | Company description                  |
| website     | string (nullable) | Company website URL           |
| keywords    | string[]   | SEO/tracking keywords                |
| createdAt   | timestamp  | Record creation time                 |
| updatedAt   | timestamp  | Last update time                     |

### NarrativeModel

Defines the messaging strategy for a project.

| Field           | Type       | Description                        |
| --------------- | ---------- | ---------------------------------- |
| id              | UUID       | Primary key                        |
| projectId       | UUID       | Parent project                     |
| coreNarrative   | string     | Central narrative statement        |
| themes          | string[]   | Key messaging themes               |
| voiceTone       | string     | Desired voice and tone             |
| targetAudiences | string[]   | Target audience segments           |
| createdAt       | timestamp  | Record creation time               |
| updatedAt       | timestamp  | Last update time                   |

### CompetitorProfile

Represents a competitor being monitored.

| Field       | Type              | Description                      |
| ----------- | ----------------- | -------------------------------- |
| id          | UUID              | Primary key                      |
| projectId   | UUID              | Parent project                   |
| name        | string            | Competitor name                  |
| website     | string (nullable) | Competitor website URL           |
| description | string            | Competitor description           |
| strengths   | string[]          | Known strengths                  |
| weaknesses  | string[]          | Known weaknesses                 |
| createdAt   | timestamp         | Record creation time             |
| updatedAt   | timestamp         | Last update time                 |

### Opportunity

A market opportunity surfaced by an agent.

| Field       | Type                                                        | Description                          |
| ----------- | ----------------------------------------------------------- | ------------------------------------ |
| id          | UUID                                                        | Primary key                          |
| projectId   | UUID                                                        | Parent project                       |
| agentId     | string                                                      | Agent that generated this            |
| type        | enum: `search`, `geo`, `reddit`, `competitor`, `content`    | Source agent type                    |
| title       | string                                                      | Short title                          |
| description | string                                                      | Detailed description                 |
| score       | number (0-100)                                              | Relevance/priority score             |
| metadata    | JSON                                                        | Agent-specific metadata              |
| status      | enum: `new`, `reviewed`, `acted`, `dismissed`               | Review status                        |
| createdAt   | timestamp                                                   | Record creation time                 |
| updatedAt   | timestamp                                                   | Last update time                     |

### Asset

A content asset generated from an opportunity.

| Field         | Type                                              | Description                          |
| ------------- | ------------------------------------------------- | ------------------------------------ |
| id            | UUID                                              | Primary key                          |
| projectId     | UUID                                              | Parent project                       |
| opportunityId | UUID (nullable)                                   | Source opportunity (if applicable)    |
| type          | enum: `article`, `social`, `email`, `ad`          | Content type                         |
| title         | string                                            | Asset title                          |
| content       | text                                              | Full content body                    |
| status        | enum: `draft`, `published`, `archived`            | Publication status                   |
| createdAt     | timestamp                                         | Record creation time                 |
| updatedAt     | timestamp                                         | Last update time                     |

### Campaign

Groups assets into a marketing campaign.

| Field       | Type                                             | Description                          |
| ----------- | ------------------------------------------------ | ------------------------------------ |
| id          | UUID                                             | Primary key                          |
| projectId   | UUID                                             | Parent project                       |
| name        | string                                           | Campaign name                        |
| description | string                                           | Campaign description                 |
| status      | enum: `draft`, `active`, `completed`             | Lifecycle status                     |
| startDate   | date (nullable)                                  | Planned start date                   |
| endDate     | date (nullable)                                  | Planned end date                     |
| createdAt   | timestamp                                        | Record creation time                 |
| updatedAt   | timestamp                                        | Last update time                     |

### AgentRun

Records the execution of a single agent job.

| Field       | Type                                                  | Description                          |
| ----------- | ----------------------------------------------------- | ------------------------------------ |
| id          | UUID                                                  | Primary key                          |
| projectId   | UUID                                                  | Parent project                       |
| agentId     | string                                                | Agent identifier                     |
| status      | enum: `pending`, `running`, `completed`, `failed`     | Execution status                     |
| startedAt   | timestamp                                             | When the run started                 |
| completedAt | timestamp (nullable)                                  | When the run finished                |
| result      | JSON (nullable)                                       | Structured result payload            |
| error       | text (nullable)                                       | Error message if failed              |
| createdAt   | timestamp                                             | Record creation time                 |

### DailyDigest

A daily summary of project activity.

| Field            | Type       | Description                           |
| ---------------- | ---------- | ------------------------------------- |
| id               | UUID       | Primary key                           |
| projectId        | UUID       | Parent project                        |
| date             | date       | The date this digest covers           |
| summary          | text       | Human-readable summary                |
| opportunityCount | number     | Number of opportunities found         |
| agentRunIds      | string[]   | IDs of agent runs included            |
| createdAt        | timestamp  | Record creation time                  |

## Relationships

- **User** `1:N` **Project** -- A user owns many projects.
- **Project** `1:1` **CompanyProfile** -- Each project has one company profile (linked via `companyProfileId` on Project or `projectId` on CompanyProfile).
- **Project** `1:1` **NarrativeModel** -- Each project has one narrative model.
- **Project** `1:N` **CompetitorProfile** -- A project tracks multiple competitors.
- **Project** `1:N` **Opportunity** -- Agents surface many opportunities per project.
- **Project** `1:N` **Asset** -- A project contains many content assets.
- **Opportunity** `1:N` **Asset** -- An asset can optionally be linked to the opportunity that inspired it.
- **Project** `1:N` **Campaign** -- A project has many campaigns.
- **Project** `1:N` **AgentRun** -- Agent executions are scoped to a project.
- **Project** `1:N` **DailyDigest** -- One digest per project per day.
