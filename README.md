# 🗳 PollingApp — Online Voting System

A full-stack web application that allows users to participate in polls and administrators to create and manage them.
Built with ASP.NET Core 8 (backend) and React + Vite (frontend), the project demonstrates secure authentication, real-time voting, and a clean, responsive UI.

## ✨ Overview

PollingApp is designed to simplify the creation and participation of online polls.

It provides two roles:
## 👤 Voter

- View all active polls
- Cast a vote (only once per poll)
- See poll results with visual charts
- Track their own vote

## 🛠 Admin

- Create new polls with multiple options
- Set poll expiration
- Enable/disable multiple voting
- Manage poll visibility

## 🔐 Key Features
### Secure Authentication

- JWT-based login and registration
- Password hashing with BCrypt
- Role-based access control (Admin / Voter)

### Robust Backend Architecture

- Repository Design Pattern
- DTO-based communication
- Service Layer for business logic
- Entity Framework Core with SQL Server

### Modern Frontend

- React + Vite
- TailwindCSS for elegant UI
- Dynamic Poll Result Charts
- Responsive layouts for all screens

## 💡 How It Works (High-Level)

- User registers or logs in
  → System creates a JWT token → Stored in browser → Used for all API calls.
- Admin creates a poll
  → Backend stores questions, options, expiry time.
- Voter selects a poll and casts their vote
  → System verifies that the poll is active and user hasn’t voted before.
- Results are displayed
  → Vote counts and percentages calculated in backend → Chart rendered in frontend.

## 🧰 Tech Stack

### Backend:
- ASP.NET Core 8
- Entity Framework Core
- SQL Server
- JWT Authentication
- BCrypt Password Hashing
- xUnit + Moq

### Frontend:
- React
- Vite
- TailwindCSS
- Axios
- React Router
- Vitest + React Testing Library

## 🚀 Purpose of the Project

This project demonstrates real-world full-stack development, including:

- API design
- Database modeling
- Authentication & authorization
- State management
- Component-based UI
- Clean architecture patterns
- Unit testing (xUnit & Vitest)

Ideal for learning modern full-stack development and showcasing skills to recruiters.

## 👨‍💻 Author: Sudhan Suresh
GitHub: https://github.com/Sudhan06-45

