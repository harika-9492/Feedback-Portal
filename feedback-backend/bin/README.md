# Feedback Backend (Spring Boot)

This folder is a standalone Spring Boot backend for the feedback portal.

## Open in Spring Boot IDE

1. Open this folder as a separate project: `feedback-backend`
2. Import as Maven project (it has `pom.xml`)
3. Run `FeedbackBackendApplication`

## Default port

- `8080`

## Database

- In-memory H2 database is configured
- H2 console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:feedbackdb`

## Seeded users

- admin@college.edu / Admin@123
- faculty1@college.edu / Faculty@123
- faculty2@college.edu / Faculty@123
- student1@college.edu / Student@123

## API summary

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users/faculty`
- `POST /api/users/faculty`
- `DELETE /api/users/faculty/{email}`
- `GET /api/forms`
- `GET /api/forms/student`
- `GET /api/forms/faculty/{email}`
- `POST /api/forms`
- `GET /api/responses`
- `POST /api/responses`
- `GET /api/responses/check?formId={id}&studentEmail={email}`
- `GET /api/analytics`
- `GET /api/analytics/{formId}`
